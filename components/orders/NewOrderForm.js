import React, { useContext } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Container,
    Typography,
    Backdrop
} from '@material-ui/core'

import ListAltIcon from '@material-ui/icons/ListAlt'
import { useSnackbar } from 'notistack'

import Spinner from '../spinner'
import SelectClient from './components/SelectClient'
import SelectProducts from './components/SelectProducts'
import OrderDetails from './components/OrderDetails'
import TotalOrder from './components/TotalOrder'

import OrdersContext from '../../context/orders/OrdersContext'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        // position: 'relative',
        paddingBottom: theme.spacing(2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 20,
    },
}));

const CREATE_ORDER = gql`
    mutation createOrder($input: OrderInput!){
        createOrder(input: $input){
            id
        }
    }
`

const GET_ORDER_BY_SELLER = gql`
    query getOrderBySeller{
        getOrderBySeller{
            id
        }
    }
`

const NewOrderForm = () => {
    const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
        // ? Qhat is createOrder -> It is the first object that comes with the CREATE_ORDER mutation, it contains the new orders
        update(cache, { data: { createOrder } }) {
            try {
                // * Get cache object we want to update 
                const { getOrderBySeller } = cache.readQuery({ query: GET_ORDER_BY_SELLER })

                if (getOrderBySeller) {
                    // * REWRITE the actual cache with the new one
                    // ! DO NOT MODIFY IT
                    cache.writeQuery({
                        query: GET_ORDER_BY_SELLER,
                        data: {
                            getOrderBySeller: [...getOrderBySeller, createOrder]
                        }
                    })
                }
            } catch (error) {
                console.log("Nothing in cache")
                cache.writeQuery({
                    query: GET_ORDER_BY_SELLER,
                })
            }
        }
    })

    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const router = useRouter()
    const { products, client, total, error } = useContext(OrdersContext)

    const createNewOrder = async (e) => {
        e.preventDefault()
        const order = products.map(({ __typename, stock, createdAt, ...product }) => product)
        try {
            const { id } = client
            const { data } = await createOrder({
                variables: {
                    input: {
                        client: id,
                        total: Number(total.toFixed(2)),
                        order
                    }
                }
            })
            enqueueSnackbar("Order successfully created", { variant: "success" })
            router.push('/orders')
        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.message, { variant: "error" })
        }

    }

    return (
        <>
            <Backdrop className={classes.backdrop} open={loading}>
                <Spinner />
            </Backdrop>

            <Grid container justify="center" alignItems="center" direction="column">
                <Container maxWidth="sm" className={classes.container}
                    component={Box}
                    boxShadow={5}
                    borderRadius={5}
                    borderTop={4}
                    bgcolor='#f6f6f6'
                    borderColor='secondary.main'
                >
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <ListAltIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            New Order
                        </Typography>
                        <form className={classes.form} noValidate>
                            <SelectClient />
                            <SelectProducts />
                            <OrderDetails />
                            <TotalOrder />
                            <Button
                                type={loading ? "button" : "submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={!client || !products.every(product => product.quantity > 0) || total === 0 || error}
                                onClick={(e) => createNewOrder(e)}
                            >
                                Create new order
                    		</Button>
                        </form>
                    </div>
                </Container>
            </Grid>
        </>
    )
}

export default NewOrderForm
