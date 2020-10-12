import React, { useContext, useState, useEffect } from 'react'
import { TextField, Grid, Box } from '@material-ui/core'
import * as Yup from 'yup'

import OrdersContext from '../../../context/orders/OrdersContext'
import ErrorMessage from '../../ErrorMessage'
const ProductDetail = ({ product }) => {
    const { quantityProductsFn, updateTotalFn, errorFn, noErrorFn } = useContext(OrdersContext)
    const [quant, setQuant] = useState(0)
    const [localError, setLocalError] = useState(null)

    const schema = Yup.number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required("Type a quantity please")
        .moreThan(-1, "Type a positive quantity please")
        .integer("Type an integer quantity please")
        .lessThan(product.stock, "Quantity not available in stock")

    useEffect(() => {
        updateQuantity()
        updateTotalFn()
        try {
            schema.validateSync(quant)
            setLocalError(null)
            noErrorFn()
        } catch (error) {
            setLocalError(error.message)
            errorFn()
        }
    }, [quant])

    const updateQuantity = () => {
        const newProduct = { ...product, quantity: Number(quant) }
        quantityProductsFn(newProduct)
    }
    return (
        <Grid item xs={12}>
            <Box mb={3}>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item xs={12} sm={6}>
                        <Box fontWeight="fontWeightMedium" display="flex" alignItems="center">
                            Product: <Box fontWeight="fontWeightRegular" ml={1}>{product.name}</Box>
                        </Box>
                        <Box fontWeight="fontWeightMedium" display="flex" alignItems="center">
                            Stock: <Box fontWeight="fontWeightRegular" ml={1}>{product.stock}</Box>
                        </Box>
                        <Box fontWeight="fontWeightMedium" display="flex" alignItems="center">
                            Price: <Box fontWeight="fontWeightRegular" ml={1}>$ {product.price}</Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="quantity"
                            label="Quantity"
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={quant}
                            onChange={(e) => {
                                setQuant(e.target.value)
                            }}
                        />
                        {localError && <Box mt={1}><ErrorMessage message={localError} /> </Box>}
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}

export default ProductDetail
