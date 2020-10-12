import React, { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'

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
import Autocomplete from '@material-ui/lab/Autocomplete';

import ListAltIcon from '@material-ui/icons/ListAlt'
import { useSnackbar } from 'notistack'

import Spinner from '../spinner'

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
            client
            seller
            order{
                quantity
            }
            total
            state
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

const AutocompleteExs = () => {
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
    const [value, setValue] = useState(null)
    const [arrayValue, setArrayValue] = useState([])
    useEffect(() => {
        console.log(value);
    }, [value])

    useEffect(() => {
        console.log(arrayValue);
    }, [arrayValue])

    const options = [
        {
            id: 'chocolate',
            name: 'Chocolate'
        },
        {
            id: 'strawberry',
            name: 'Strawberry'
        },
        {
            id: 'vanilla',
            name: 'Vanilla'
        }
    ]

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
                            <Box mt={2}>


                                <Autocomplete
                                    options={options}
                                    getOptionLabel={(option) => option.name}
                                    id="autocomplete-flavors"
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select a flavor"
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    )}
                                />
                            </Box>
                            <Box mt={2}>

                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={options}
                                    getOptionLabel={(option) => option.name}
                                    filterSelectedOptions
                                    value={arrayValue}
                                    onChange={(event, values) => {
                                        setArrayValue(values)
                                    }}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Select a flavor"
                                        />
                                    )}
                                />
                            </Box>

                            <Button
                                type={loading ? "button" : "submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
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

export default AutocompleteExs
