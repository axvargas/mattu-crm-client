import React from 'react'
import { useRouter } from 'next/router'
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

import { useMutation, gql } from '@apollo/client'

import PostAddIcon from '@material-ui/icons/PostAdd'
import { makeStyles } from '@material-ui/core/styles'

import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers'
import * as yup from "yup"

import { useSnackbar } from 'notistack'

import ErrorMessage from '../ErrorMessage'
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

const CREATE_PRODUCT = gql`
    mutation createProduct($input: ProductInput!){
        createProduct(input: $input){
            id
            name
            stock
            price
            createdAt
        }
    }
`

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

const NewProductForm = () => {

    const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
        // ? Qhat is createProduct -> It is the first object that comes with the CREATE_PRODUCT mutation, it contains the new product
        update(cache, { data: { createProduct } }) {
            try {
                // * Get cache object we want to update 
                const { getAllProducts } = cache.readQuery({ query: GET_ALL_PRODUCTS })

                if (getAllProducts) {
                    // * REWRITE the actual cache with the new one
                    // ! DO NOT MODIFY IT
                    cache.writeQuery({
                        query: GET_ALL_PRODUCTS,
                        data: {
                            getAllProducts: [...getAllProducts, createProduct]
                        }
                    })
                }
            } catch (error) {
                console.log("Nothing in cache")

                cache.writeQuery({
                    query: GET_ALL_PRODUCTS,
                })
            }
        }
    })

    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()

    const classes = useStyles()

    const schema = yup.object().shape({
        name: yup
            .string()
            .required("Type the name please"),
        stock: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .required("Type the stock please")
            .positive("Type a positive stock please")
            .integer("Type only integer numbers as stock please"),
        price: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .required("Type the price please")
            .positive("Type a positive price please")
    })

    const { handleSubmit, errors, setError, register } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur'
    });

    const onSubmit = async (formData) => {
        try {
            const { data } = await createProduct({
                variables: {
                    input: formData
                }
            })
            enqueueSnackbar(`Product successfully created`, { variant: "success" })
            router.push('/products')
        } catch (error) {
            if (error.message.includes('already exists')) {
                setError("name", { type: "validate", message: error.message })
            } else {
                enqueueSnackbar(error.message, { variant: "error" })
            }
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
                            <PostAddIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            New Product
                        </Typography>
                        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Product name"
                                name="name"
                                autoComplete="off"
                                autoFocus
                                inputRef={register}
                            />
                            {errors.name && <ErrorMessage message={errors.name.message} />}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="price"
                                label="Price"
                                name="price"
                                type="number"
                                autoComplete="off"
                                inputRef={register}
                            />
                            {errors.price && <ErrorMessage message={errors.price.message} />}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="stock"
                                label="Stock"
                                name="stock"
                                type="number"
                                autoComplete="off"
                                inputRef={register}
                            />
                            {errors.stock && <ErrorMessage message={errors.stock.message} />}

                            <Button
                                type={loading ? "button" : "submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Create new product
                    		</Button>
                        </form>
                    </div>
                </Container>
            </Grid>
        </>
    )
}

export default NewProductForm
