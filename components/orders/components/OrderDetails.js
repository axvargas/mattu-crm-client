import React, { useContext } from 'react'
import { Box, Grid } from '@material-ui/core'
import OrdersContext from '../../../context/orders/OrdersContext'
import ProductDetail from './ProductDetail'
const OrderDetails = () => {
    const { products } = useContext(OrdersContext)


    return (
        <Box mt={5}>
            <Grid
                container
            >
                {products.length > 0 ?
                    products.map(product => (
                        <ProductDetail key={product.id} product={product} />
                    ))
                    :
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >

                        <Box fontSize="subtitle1.fontSize" color="text.secondary" textAlign="center" mb={2}>
                            No products selected
                        </Box>
                    </Grid>

                }
            </Grid>
        </Box>
    )
}

export default OrderDetails
