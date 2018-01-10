import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import axios from 'axios';

import Environment from '../Environment';
import Utils from '../Utils';
import Input from './Input';

const FormStepEnum = {
  CONTACT: 1,
  PAYMENT: 2,
  SUCCESS: 3,
  ERROR: 10,
};

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideAddress: false,
      isDonation: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Reset to initial state
    if (nextProps.item) {
      this.setState({
        isDonation: nextProps.item.isDonation || false
      });
    }
  }

  formatAmount(event) {
    let value = parseInt(event.target.value.replace(/\D/g, ''), 10);
    if (isNaN(value)) {
      value = 0;
    }

    if (value < 5) {
      event.target.setCustomValidity('Summan on oltava >= 5');
    } else {
      // Clear validation error.
      event.target.setCustomValidity('');
    }

    event.target.value = (value + ' €').toLocaleString();
  }

  render() {
    const {handleSubmit} = this.props;

    console.log('ContactForm::render()');

    return (
      <form
        model="payment"
        onSubmit={handleSubmit}>
        <Input
          type="text"
          name="amount"
          defaultValue="50 €"
          className="form-control-lg"
          error=""
          placeholder="50 €"
          required
          onBlur={this.formatAmount} />
        <div className="row no-gutters">
          <div className="col">
            <Input
              type="text"
              name="first_name"
              error="Syötä etunimesi"
              placeholder="Etunimi"
              required />
          </div>
          <div className="mx-1"></div>
          <div className="col">
            <Input
              type="text"
              name="last_name"
              error="Syötä sukunimesi"
              placeholder="Sukunimi"
              required />
          </div>
        </div>
        <div className="form-group">
          <Input
            type="email"
            name="email"
            placeholder="Sähköposti"
            error="Syötä sähköpostiosoitteesi"
            required />
        </div>
        {!this.state.isDonation &&
          <div>
            <div className={this.state.hideAddress ? 'd-none' : ''}>
              <div className="form-group">
                <Input
                  type="text"
                  name="address"
                  placeholder="Osoite"
                  error="Anna osoite"
                  required />
              </div>
              <div className="row no-gutters">
                <div className="col">
                  <Input
                    type="text"
                    name="postal_code"
                    error="Syötä postinumero"
                    placeholder="Postinumero"
                    required />
                </div>
                <div className="mx-1"></div>
                <div className="col">
                  <Input
                    type="text"
                    name="city"
                    error="Syötä postitoimipaikkasi"
                    placeholder="Postitoimipaikka"
                    required />
                </div>
              </div>
            </div>
          </div>
        }

        <input type="hidden" name="key" />
        <button type="submit" className="btn btn-success">Lahjoita nyt!</button>
      </form>
    );
  }
};

const PaymentMethods = ({ buttons }) => {
  const paymentMethod = buttons.map(item => {
    return (
      <div className="col-6 paymentMethod mb-2" key={item.name}>
        <form action={item.url} method="POST">
          <button type="submit" className="payment-method-button">
            <img src={item.icon} alt={item.name} />
          </button>
          {Object.keys(item.fields).map(key => {
            return (
              <input type="hidden" name={key} value={item.fields[key] || ''} key={key} />
            );
          })}
        </form>
      </div>
    );
  });

  return (
    <div className="row">
      {paymentMethod}
    </div>
  );
}

class DonationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [],
      step: FormStepEnum.CONTACT,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Reset to initial state if item is null
    if (!nextProps.item) {
      this.setState({
        step: FormStepEnum.CONTACT
      });
    }
  }

  goBack() {
    Utils.scrollTo(document.documentElement, 0, 300);

    // Go back to initial state
    this.setState({
      step: FormStepEnum.CONTACT,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    let result = {};
    const target = event.target;
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      result[key] = value;
    });

    result.amount = parseInt(event.target.amount.value.replace(/\D/g, ''), 10);
    result.item = this.props.item.title;

    if (result.emailOnly) {
      delete result.address;
      delete result.postal_code;
      delete result.city;
    }

    console.log(result);

    Utils.analytics.initiateCheckout(result.amount);

    let promise = axios.post(Environment.endpoint + '/payment', { payment: result });
    promise.then(res => {
      console.log('Key: ' + res.data.key);

      target.key.value = res.data.key;

      // Go to next state
      this.setState({
        buttons: res.data.buttons,
        step: FormStepEnum.PAYMENT
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({
        step: FormStepEnum.ERROR
      });
    });
  }

  render() {
    const { step } = this.state;

    const duration = 300;

    const transitionStyles = {
      entered:  { height: 'auto', opacity: 1, transform: 'translateX(0)' },
      exiting: { height: 'auto', transform: 'translateX(-50%)' },
    };

    const defaultStyle = {
      transition: `all ${duration}ms ease-in-out`,
      transform: 'translateX(50%)',
      animationIterationCount: 3,
      opacity: 0,
      height: 0,
    }

    if (step === FormStepEnum.ERROR) {
      return (
        <div className="alert alert-danger" role="alert">
          <strong>Oh snap!</strong> Jokin meni vikaan
        </div>
      );
    }

    return (
      <div>
        <Transition in={step === FormStepEnum.CONTACT} timeout={duration}>
          {(state) => (
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              <ContactForm
                handleSubmit={this.handleSubmit}
                item={this.props.item} />
            </div>
          )}
        </Transition>
        <Transition in={step === FormStepEnum.PAYMENT} timeout={duration}>
          {(state) => (
            <div>
              <div style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }}>
                <PaymentMethods buttons={this.state.buttons} />
                <div className="mt-2 ml-4">
                  <button
                    className="btn btn-primary"
                    onClick={this.goBack}
                    type="button">
                      Edellinen
                  </button>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
    );
  }
}

export default DonationForm;
