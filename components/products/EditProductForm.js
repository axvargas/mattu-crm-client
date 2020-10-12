import React from 'react'

import { useRouter } from 'next/router'

import { useMutation, gql } from '@apollo/client'
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

import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/core/styles'

import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers'
import * as yup from "yup"
import { useSnackbar } from 'notistack';

import ErrorMessage from '../../components/ErrorMessage'
import Spinner from '../../components/spinner'

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

const UPDATE_PRODUCT = gql`
    mutation updatedProduct($id: ID!, $input: ProductUpdateInput!){
        updateProduct(id: $id, input: $input){
            id
            name
            stock
            price
        }
    }
`

const EditProductForm = ({ product }) => {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const router = useRouter()

    const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT)

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
        defaultValues: {
            id: product.id,
            name: product.name,
            stock: product.stock,
            price: product.price
        }
    });

    const onSubmit = async (formData) => {
        try {
            const { data } = await updateProduct({
                variables: {
                    id: product.id,
                    input: formData
                }
            })
            enqueueSnackbar(`Product successfully edited`, { variant: "success" })
            router.push('/products')
        } catch (error) {
            if (error.message.includes('exist')) {
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
                            <EditIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Edit Product
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
                                Edit product
                    		</Button>
                        </form>
                    </div>
                </Container>
            </Grid>
        </>
    )
}

export default EditProductForm