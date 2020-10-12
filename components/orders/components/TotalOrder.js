import React, { useContext } from 'react'
import { Grid, Box } from '@material-ui/core'
import OrdersContext from '../../../context/orders/OrdersContext'

const TotalOrder = () => {
    const { total } = useContext(OrdersContext)

    return (
        <>
            <Box mt={2}>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item xs={12} sm={6}>
                        <Box fontWeight="fontWeightMedium" fontSize="h6.fontSize" alignItems="center">
                            Total:
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            border={2}
                            borderColor="secondary.main"
                            borderRadius={8}
                            p={1}
                            px={2}
                            fontWeight="fontWeightBold"
                            fontSize={16}
                            bgcolor='#38b2ac38'
                        >
                            $ {total.toFixed(2)}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default TotalOrder
