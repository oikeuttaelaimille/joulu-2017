import * as React from 'react'
import { navigate } from 'gatsby'
import axios from 'axios'

import { Col, Row, FormGroup, FormText, Label, Input, InputGroup, InputGroupAddon, Button, Form, ModalBody, ModalFooter } from 'reactstrap'
import { formToJSON } from '../cool'

interface Props {}

const PaymentForm: React.FC<Props> = ({}) => {
  const [error, setError] = React.useState(null)

  const submitForm: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    const from = event.currentTarget
    //const data = new FormData(event.currentTarget)
    const endpoint = 'https://o4swfi2g36.execute-api.eu-north-1.amazonaws.com/prod'
    //const endpoint = 'https://mmgjoke0wk.execute-api.eu-north-1.amazonaws.com/dev'

    const data = formToJSON(from.elements)
    const contact = {
      first_name: data['contact[first_name]'],
      email: data['contact[email]'],
      last_name: data['contact[last_name]'],
      postal_code: data['contact[postal_code]'],
      city: data['contact[city]'],
      address: data['contact[address]']
    }
    ;(data as any).contact = contact

    // Propagate onError?
    // this.props.onError && this.props.onError(error);
    axios
      .post(`${endpoint}/donation/once`, data)
      .then(res => {
        navigate('/maksu', { state: { buttons: res.data.data } })
      })
      .catch(err => setError(err))
  }
  const ulla = '7011v000000SWciAAG'
  const eero = '7011v000000SWcdAAG'
  const eerodigi = '7011v000000SWcnAAG'
  const ulladigi = '7011v000000SWcsAAG'

  return (
    <Form onSubmit={submitForm}>
      <ModalBody>
        <FormGroup>
          <Label htmlFor="korttivalinta">Tilaan:</Label>
          <Input type="select" name="campaign" id="korttivalinta">
            <option value={eero}>Eero Lampisen naalikortin</option>
            <option value={ulla}>Ulla Thynellin naalikortin</option>
            <option value={eerodigi}>Eero Lampisen kortin vain digitaalisena</option>
            <option value={ulladigi}>Ulla Thynellin kortin vain digitaalisena</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="amount">Summa</Label>
          <InputGroup>
            <Input type="number" name="amount" id="amount" bsSize="lg" required min="10" defaultValue="50" />
            <InputGroupAddon addonType="append">€</InputGroupAddon>
          </InputGroup>
          <FormText>Vapaavalintainen lahjoitussumma korttiin.</FormText>
        </FormGroup>
        <Row>
          <Col>
            <FormGroup>
              <Label for="first_name">Etunimi</Label>
              <Input type="text" name="contact[first_name]" id="first_name" required />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="last_name">Sukunimi</Label>
              <Input type="text" name="contact[last_name]" id="last_name" required />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="email">Sähköposti</Label>
          <Input type="email" name="contact[email]" id="email" />
        </FormGroup>
        <FormGroup>
          <Label for="address">Osoite</Label>
          <Input type="text" name="contact[address]" id="address" required />
        </FormGroup>
        <Row>
          <Col>
            <FormGroup>
              <Label for="postal_code">Postinumero</Label>
              <Input type="text" name="contact[postal_code]" id="postal_code" required />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="city">Postitoimipaikka</Label>
              <Input type="text" name="contact[city]" id="city" required />
            </FormGroup>
          </Col>
        </Row>
        <input type="hidden" name="return" value="https://oikeuttaelaimille.fi/lahjoita/kiitos" />

        {error && <div>error</div>}
        <FormText>Maksettuasi lahjoituksen postitamme kortin osoitteeseesi.</FormText>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" color="primary">
          Tilaan joulukortin
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default PaymentForm
