import React from 'react'

import NewOrderForm from '../components/orders/NewOrderForm'
import ProtectedInfo from '../components/security/ProtectedInfo'

const NewOrder = () => {
    return (
        <ProtectedInfo>
            <NewOrderForm />
        </ProtectedInfo>
    )
}

export default NewOrder

