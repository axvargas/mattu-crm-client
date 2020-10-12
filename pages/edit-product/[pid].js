import React from 'react'
import { useRouter } from 'next/router'
import ProtectedInfo from '../../components/security/ProtectedInfo'
import ProductGetter from '../../components/products/ProductGetter'

const EditProduct = () => {
    const router = useRouter()
    const { query: { id } } = router

    return (
        <ProtectedInfo>
            <ProductGetter id={id} />
        </ProtectedInfo>
    )
}

export default EditProduct