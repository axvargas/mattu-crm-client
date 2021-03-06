import React from 'react'

import ProtectedInfo from '../components/security/ProtectedInfo'
import OrderTable from '../components/orders/OrderTable'

const Orders = () => {
    return (
        <ProtectedInfo>
            <OrderTable />
        </ProtectedInfo>
    )
}

export default Orders

