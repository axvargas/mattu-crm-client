import React, { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    TextField,
    MenuItem,
    Button
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import PersonIcon from '@material-ui/icons/Person'
import EmailIcon from '@material-ui/icons/Email'
import PhoneIcon from '@material-ui/icons/Phone'

import { useSnackbar } from 'notistack'

import ConfirmationDialog from '../ConfirmationDialog'

const UPDATE_ORDER = gql`
    mutation updateOrder($id: ID!, $input: OrderInput!) {
        updateOrder(id: $id, input: $input) {
            id
            order {
                id
                quantity
                name
                price
            }
            seller
            total
            state
        }
    }
`

const DELETE_ORDER = gql`
    mutation deleteOrder($id: ID!) {
        deleteOrder(id: $id) 
    }
`

const GET_ORDER_BY_SELLER = gql`
    query getOrderBySeller{
        getOrderBySeller{
            id
        }
    }
`

const Order = ({ data }) => {
    const [id, order, client, seller, total, state] = data
    const { id: clientID, firstName, lastName, email, telephone } = client

    const [updateOrder] = useMutation(UPDATE_ORDER, {
        update(cache, { data: { updateOrder } }) {
            try {
                // * Get cache object we want to update 
                const { getOrderBySeller } = cache.readQuery({ query: GET_ORDER_BY_SELLER })
                // * REWRITE theactual cache with the new one
                // ! DO NOT MODIFY IT
                cache.evict({ broadcast: false });
                cache.writeQuery({
                    query: GET_ORDER_BY_SELLER,
                    data: {
                        getOrderBySeller: getOrderBySeller.map((order) => order.id === id ? updateOrder : order)
                    }
                })
            } catch (error) {
                cache.writeQuery({
                    query: GET_ORDER_BY_SELLER,
                })
            }
        }
    })
    const [deleteOrder, { loading: ldg }] = useMutation(DELETE_ORDER, {
        update(cache) {
            try {
                // * Get cache object we want to update 
                const { getOrderBySeller } = cache.readQuery({ query: GET_ORDER_BY_SELLER })
                // * REWRITE theactual cache with the new one
                // ! DO NOT MODIFY IT
                cache.evict({ broadcast: false });
                cache.writeQuery({
                    query: GET_ORDER_BY_SELLER,
                    data: {
                        getOrderBySeller: getOrderBySeller.filter((order) => order.id !== id)
                    }
                })
            } catch (error) {
                cache.writeQuery({
                    query: GET_ORDER_BY_SELLER,
                })
            }
        }
    })

    const { enqueueSnackbar } = useSnackbar()
    const [status, setStatus] = useState(state)
    const [open, setOpen] = useState(false)
    const [classname, setClassname] = useState('')
    const statuses = [
        {
            value: "PENDING",
            label: "PENDING"
        },
        {
            value: "COMPLETED",
            label: "COMPLETED"
        },
        {
            value: "CANCELLED",
            label: "CANCELLED"
        }
    ]
    useEffect(() => {
        if (status)
            setStatus(status)
        classNameChange();
    }, [status])

    const classNameChange = () => {
        if (status === "PENDING")
            setClassname('#f9a825')
        else if (status === "COMPLETED")
            setClassname('#388e3c')
        else if (status === "CANCELLED")
            setClassname('#b71c1c')
    }

    const changeOrderStatus = async (newStatus) => {
        try {
            const { data } = await updateOrder({
                variables: {
                    id,
                    input: {
                        client: clientID,
                        state: newStatus
                    }
                }
            })
            console.log(data.updateOrder);
            setStatus(data.updateOrder.state)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const handleDeleteOrder = async () => {
        try {
            const { data } = await deleteOrder({
                variables: {
                    id
                }
            })
            enqueueSnackbar("Order successfully deleted", { variant: 'success' })
            setOpen(false)
        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }
    return (
        <>
            <CssBaseline />
            <Box borderRadius="borderRadius" boxShadow={3} p={2} mx={2} mt={2} borderTop={4} borderColor={classname}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Box>
                            <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                                Client
                            </Box>
                            <Box mt={1} display="flex" alignItems="center">
                                <PersonIcon fontSize="small" color="secondary" />
                                <Box ml={1}>
                                    {firstName} {lastName}
                                </Box>
                            </Box>
                            <Box mt={1} display="flex" alignItems="center">
                                <EmailIcon fontSize="small" color="secondary" />
                                <Box ml={1}>{email}</Box>
                            </Box>
                            <Box mt={1} display="flex" alignItems="center">

                                <PhoneIcon fontSize="small" color="secondary" />
                                <Box ml={1}>
                                    {telephone}
                                </Box>
                            </Box>
                        </Box>

                        <Box mt={2}>
                            <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                                Status
                            </Box>
                            <Box mt={1} >
                                <TextField
                                    id="outlined-select-status"
                                    size="small"
                                    select
                                    value={status}
                                    onChange={(e) => {
                                        changeOrderStatus(e.target.value)
                                    }}
                                    variant="outlined"
                                    color="secondary"
                                >
                                    {statuses.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>

                    </Grid>
                    <Grid item xs={12} sm={6}>

                        <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                            Order Details
                            </Box>
                        {
                            order.map((product) => (
                                <Box key={product.id} mt={1} >
                                    <Box fontWeight="fontWeightMedium" display="flex" alignItems="center">
                                        Product: <Box fontWeight="fontWeightRegular" ml={1}>{product.name}</Box>
                                    </Box>
                                    <Box fontWeight="fontWeightMedium" display="flex" alignItems="center">
                                        Quantity: <Box fontWeight="fontWeightRegular" ml={1}>{product.quantity}</Box>
                                    </Box>
                                </Box>
                            ))
                        }
                        <Box mt={2}>
                            <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                                Total
                            </Box>

                            <Box fontSize="subtitle1.fontSize" fontWeight="fontWeightRegular" mt={1}>
                                $ {total}
                            </Box>

                        </Box>

                        <Box display="flex" alignItems="center" mt={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={() => setOpen(true)}
                            >
                                Delete Order
                             </Button>
                        </Box>

                    </Grid>
                </Grid>
            </Box>
            {open &&
                < ConfirmationDialog
                    open={open}
                    handleCancel={handleCancel}
                    handleDelete={handleDeleteOrder}
                    title="Are you sure you want to delete this order?"
                    message={<>The order <b>{id}</b> will be permenently deleted and will be impossible to be recovered</>}
                    loading={ldg}
                />
            }
        </>
    )
}

export default Order
