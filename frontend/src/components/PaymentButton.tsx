import * as React from 'react'

interface Props {
  payment: {
    providers: [
      {
        url: string,
        name: string
        svg: string
        parameters: [
          {
            name: string
            value: string
          }
        ]
      }
    ]
  },
  className?: string
}

const PaymentButtons: React.FC<Props> = ({ payment, className }) => (
  <div className={className}>
    {payment.providers.map(provider => (
      <form method="POST" action={provider.url} key={provider.name} className="payment-button">
        {provider.parameters.map(({ name, value }) => (
          <input type="hidden" name={name} value={value} />
        ))}
        <button type="submit">
          <img src={provider.svg} alt={provider.name}/>
        </button>
      </form>
    ))}
  </div>
)

export default PaymentButtons