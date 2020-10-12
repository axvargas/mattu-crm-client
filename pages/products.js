import React from 'react'

import ProtectedInfo from '../components/security/ProtectedInfo'
import ProductTable from '../components/products/ProductTable'

const Products = () => {
    return (
        <ProtectedInfo>
            <ProductTable />
        </ProtectedInfo>
    )
}

export default Products
