import React from 'react'
import ProtectedInfo from '../components/security/ProtectedInfo'
import BestSellersChart from '../components/best-sellers/BestSellersChart.js'
const BestSellers = () => {
    return (
        <ProtectedInfo>
            <BestSellersChart />
        </ProtectedInfo>
    )
}

export default BestSellers
