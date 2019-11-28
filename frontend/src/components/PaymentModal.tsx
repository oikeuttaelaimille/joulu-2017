import React from 'react'

import { Modal, ModalHeader } from 'reactstrap'

import PaymentForm from './PaymentForm'

interface Props {
  isOpen: boolean
  toggle: () => void
}

const PaymentModal: React.FC<Props> = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader toggle={toggle}>Tilaa ihana joulukortti!</ModalHeader>

      <PaymentForm />
    </Modal>
  )
}

export default PaymentModal
