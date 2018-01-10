# This code assumes C locale is set

import os
import re
import hmac
import hashlib
import uuid
import base64
import traceback
import functools

import hug
import falcon
import cachetools

from datetime import datetime, timezone, timedelta
from re import sub

from marshmallow import Schema, fields
from pynamodb.models import Model
from pynamodb import attributes

from checkout import Contact, Payment, Checkout

INDEX_UUID = '00000000-index'
DYNAMODB_CACHE_TTL = 60
DATETIME_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'

# https://checkoutfinland.github.io/
PAYMENT_REFERENCE_NUMBER = '4129'
PAYMENT_MESSAGE = 'Lahjoitus'
PAYMENT_CURRENCY = 'EUR'
PAYMENT_LANGUAGE = 'FI'
PAYMENT_CONTENT = '1'  # 1 for regular content
PAYMENT_DEFAULT_COUNTRY = 'FIN'

CONFIRM_URL = os.environ.get('CONFIRM_URL')
CANCEL_URL = os.environ.get('CANCEL_URL')

checkout = Checkout(
    os.environ.get('CHECKOUT_MERCHANT_ID', '375917'),
    os.environ.get('CHECKOUT_MERCHANT_SECRET', 'SAIPPUAKAUPPIAS')
)

class PaymentSchema(Schema):
    """PaymentSchema type"""
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email = fields.Email(required=True)
    amount = fields.Integer(required=True, validate=lambda n: 0 < n < 100000000)
    item = fields.Str()
    address = fields.Str()
    postal_code = fields.Str()
    city = fields.Str()
    country = fields.Str()

class ConfirmSchema(Schema):
    """PaymentSchema type"""
    VERSION = fields.Str(required=True)
    STAMP = fields.Str(required=True)
    REFERENCE = fields.Integer(required=True)
    PAYMENT = fields.Integer(required=True)
    STATUS = fields.Integer(required=True)
    ALGORITHM = fields.Integer(required=True)
    MAC = fields.Str(required=True)

payment_schema = PaymentSchema()
confirm_schema = ConfirmSchema()

def _make_key():
    """Generate hash key"""
    return base64.b64encode(os.urandom(15)).decode().replace('+', '-').replace('/', '.')

class TopDonationMap(attributes.MapAttribute):
    amount = attributes.NumberAttribute()
    name = attributes.UnicodeAttribute()

class PaymentModel(Model):
    """PaymentModel type"""
    class Meta:
        table_name = "JouluPayments"
        region = os.environ.get('AWS_REGION', 'eu-central-1')

    def make_payment(self):
        """Return checkout Payment object"""

        print(self.key)

        return Payment(
            order_number=self.key,
            amount=str(self.amount * 100),
            delivery_date=datetime.utcnow().strftime('%Y%m%d'),
            reference_number=PAYMENT_REFERENCE_NUMBER,
            message=PAYMENT_MESSAGE,
            currency=PAYMENT_CURRENCY,
            language=PAYMENT_LANGUAGE,
            content=PAYMENT_CONTENT,
            return_url=CONFIRM_URL,
            cancel_url=CANCEL_URL,
            contact=Contact(
                first_name=self.first_name,
                last_name=self.last_name,
                email=self.email,
                country=self.country
            )
        )

    key = attributes.UnicodeAttribute(hash_key=True, default=_make_key)
    updated = attributes.UTCDateTimeAttribute(default=datetime.utcnow())
    amount = attributes.NumberAttribute()
    goal = attributes.NumberAttribute(null=True)
    top_donations = attributes.ListAttribute(null=True, of=TopDonationMap)

    first_name = attributes.UnicodeAttribute(null=True)
    last_name = attributes.UnicodeAttribute(null=True)
    email = attributes.UnicodeAttribute(null=True)
    address = attributes.UnicodeAttribute(null=True)
    postal_code = attributes.UnicodeAttribute(null=True)
    city = attributes.UnicodeAttribute(null=True)
    country = attributes.UnicodeAttribute(null=True, default=PAYMENT_DEFAULT_COUNTRY)
    confirmed = attributes.BooleanAttribute(null=True)
    item = attributes.UnicodeAttribute(null=True)

@cachetools.cached(cachetools.TTLCache(maxsize=1, ttl=DYNAMODB_CACHE_TTL))
def get_index():
    """Return and cache index object"""
    return PaymentModel.get(INDEX_UUID)

@hug.response_middleware()
def process_data(request, response, resource):
    response.set_header('Access-Control-Allow-Origin', '*')
    response.set_header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
    response.set_header('Access-Control-Allow-Headers',
                        'Authorization,Keep-Alive,User-Agent,If-Modified-Since,Cache-Control,Content-Type')
    response.set_header('Access-Control-Expose-Headers',
                        'Authorization,Keep-Alive,User-Agent,If-Modified-Since,Cache-Control,Content-Type')

    if request.method == 'OPTIONS':
        response.set_header('Access-Control-Max-Age', '1728000')
        response.set_header('Content-Type', 'text/plain charset=UTF-8')
        response.set_header('Content-Length', 0)
        response.status_code = hug.HTTP_204

@hug.exception(Exception)
def handle_exception(exception, response):
    traceback.print_tb(exception.__traceback__)

    if response:
        response.status = falcon.HTTP_500
        response.set_header('Access-Control-Allow-Origin', '*')
        response.set_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        response.set_header('Access-Control-Allow-Headers',
                            'Authorization,Keep-Alive,User-Agent,If-Modified-Since,Cache-Control,Content-Type')
        response.set_header('Access-Control-Expose-Headers',
                            'Authorization,Keep-Alive,User-Agent,If-Modified-Since,Cache-Control,Content-Type')

@hug.directive()
def if_modified_since(request=None, **kwargs):
    """Get If-Modified-Since header from request"""
    if request:
        try:
            modified = request.get_header('If-Modified-Since')
            modified = datetime.strptime(modified or '', DATETIME_FORMAT)
            return modified.replace(tzinfo=timezone.utc)
        except ValueError as err:
            pass  # Header was malformed or missing

    return None

@hug.get('/')
def index(if_modified: if_modified_since, response=None):
    """Get index"""

    index = get_index()

    if if_modified and index.updated.replace(microsecond=0) <= if_modified:
        response.status = falcon.HTTP_304
        return

    if response:
        response.set_header('Cache-Control', 'public, max-age=%d' % 600)
        response.set_header('Last-Modified', index.updated.strftime(DATETIME_FORMAT))

    return {
        'total': index.amount,
        'goal': index.goal,
        'top_donations': [{
            'name': donation.name,
            'amount': donation.amount
        } for donation in (index.top_donations or [])]
    }

@hug.post('/payment')
def create_payment(payment: payment_schema):
    """Create payment"""

    print(payment)

    model = PaymentModel(**payment, confirmed=False)
    payment = model.make_payment()

    # Fetch data for different payment providers for created payment
    data = checkout.get_onsite_button_data(payment)
    model.save()

    return {
        'key': model.key,
        'buttons': data
    }

@hug.put('/payment/{key}')
def create_payment(key: str, payment: payment_schema, response):
    """Update payment"""

    if key == INDEX_UUID:
        response.status = falcon.HTTP_400
        return

    model = PaymentModel(**payment, confirmed=False, key=key)
    payment = model.make_payment()

    # Fetch data for different payment providers for created payment
    data = checkout.get_onsite_button_data(payment)
    model.save(PaymentModel.confirmed == False)

    return {
        'key': model.key,
        'buttons': data
    }

@hug.post('/payment/confirm')
def confirm_payment(confirm: confirm_schema, response):
    """Confirm payment"""
    msg = '&'.join([str(confirm[key]) for key in (
        'VERSION', 'STAMP', 'REFERENCE', 'PAYMENT', 'STATUS', 'ALGORITHM'
    )])

    mac = hmac.new(
        checkout.merchant_secret.encode(),
        msg=msg.encode(),
        digestmod=hashlib.sha256
    ).hexdigest().upper()

    if mac != confirm['MAC']:
        response.status = falcon.HTTP_400
        return {'OK': False}

    print("Confirmed payment " + confirm['STAMP'])

    # First mark payment confirmed
    payment = PaymentModel.get(confirm['STAMP'])
    is_confirmed = payment.confirmed
    payment.update(actions=[
        PaymentModel.confirmed.set(True)
    ])

    # Update index
    if not is_confirmed:
        index = PaymentModel.get(INDEX_UUID)
        donation = TopDonationMap(
            amount=payment.amount,
            name='{} {}.'.format(payment.first_name.title(), payment.last_name[0].title())
        )

        top_donations = index.top_donations or []
        if len(top_donations) <= 3  or payment.amount >= top_donations[-1].amount:
            top_donations.append(donation)
            top_donations.sort(key=lambda donation: donation.amount, reverse=True)

        index.update(actions=[
            PaymentModel.amount.add(payment.amount),
            PaymentModel.top_donations.set(top_donations[0:3]),
            PaymentModel.updated.set(datetime.utcnow())
        ])

    return {
        'OK': True,
        'amount': payment.amount
    }

@hug.cli()
def install(goal: hug.types.number,
            read_capacity: hug.types.number = 1,
            write_capacity: hug.types.number = 1):
    """Set up database"""
    print('Installing database')

    if not PaymentModel.exists():
        PaymentModel.create_table(
            read_capacity_units=read_capacity,
            write_capacity_units=write_capacity,
            wait=True)

    try:
        index = PaymentModel(INDEX_UUID, amount=0, goal=goal)
        index.save(PaymentModel.amount.does_not_exist())
    except pynamodb.exceptions.PutError:
        pass

if __name__ == '__main__':
    install.interface.cli()
