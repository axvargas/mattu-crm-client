import React from 'react'

import NewProductForm from '../components/products/NewProductForm'
import ProtectedInfo from '../components/security/ProtectedInfo'

const NewClient = () => {
    return (
        <ProtectedInfo>
            <NewProductForm />
        </ProtectedInfo>
    )
}

export default NewClient
