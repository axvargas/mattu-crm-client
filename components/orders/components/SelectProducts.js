import React, { useState, useEffect, useContext } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import {
    Box,
    TextField,
    CircularProgress
} from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete'

import OrdersContext from '../../../context/orders/OrdersContext'

const GET_ALL_PRODUCTS = gql`
    query getAllProducts{
        getAllProducts {
            id
            name
            price
            stock
            createdAt
        }
    }
`

const SelectProducts = () => {
    const { loading, data } = useQuery(GET_ALL_PRODUCTS)

    const { products, selectProductsFn } = useContext(OrdersContext)

    return (
        <Box mt={2}>
            <Autocomplete
                multiple
                id="autocomplete-products"
                options={data ? data.getAllProducts : []}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                value={products}
                onChange={(event, values) => {
                    selectProductsFn(values)
                }}
                getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Select the products"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="secondary" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        </Box>
    )
}

export default SelectProducts
