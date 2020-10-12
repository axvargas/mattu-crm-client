import React from 'react'
import ProtectedInfo from '../components/security/ProtectedInfo'
import BestClientsChart from '../components/best-clients/BestClientsChart.js'
const BestSellers = () => {
    return (
        <ProtectedInfo>
            <BestClientsChart />
        </ProtectedInfo>
    )
}

export default BestSellers
