import * as React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import IndexLayout from '../layouts';
import PaymentButtons from '../components/PaymentButton';

interface Props {
  location: {
    state?: {
      buttons: any
    }
  }
}

const StyledPaymentButtons = styled(PaymentButtons)`

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .payment-button {
    margin: 2px;
  }

  img {
    height: 2rem;
    padding: 4px;
  }
`

const MaksuPage: React.FC<Props> = ({ location: { state }}) => {
  return (
    <IndexLayout>
      {state && (
        <div className="text-white text-center" css={css`
          margin: 0 auto;
          max-width: 500px;
        `}>
          <h1>Kiitos paljon!</h1>
          <p>Maksettuasi lahjoituksen postitamme kortin osoitteeseesi.</p>
          <p>Valitse maksutapa:</p>
          <StyledPaymentButtons payment={state.buttons} />
        </div>
      )}
      {!state && (
        <div className="text-center text-white" css={css`
          height: 80vh;
          display: flex;
          align-items: center;
        `}>
          <h1 className="mx-auto">O-ou</h1>
        </div>
      )}
    </IndexLayout>
  )
}

export default MaksuPage
