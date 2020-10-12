import React from 'react'
import { useQuery, gql } from '@apollo/client'

import Spinner from '../spinner'
import EditProductForm from './EditProductForm'

const GET_PRODUCT_BY_ID = gql`
    query getProductById($id: ID!) {
        getProductById(id: $id) {
            id
            name
            stock
            price
        }
    }
`
const ProductGetter = ({ id }) => {
    const { data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        variables: {
            id
        },
    })
    
    return (
        <>
            {loading || !data.getProductById ?
                <Spinner />
                :
                <EditProductForm product={data.getProductById} />
            }
        </>
    )
}

export default ProductGetter
