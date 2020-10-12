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

const UPDATE_CLIENT = gql`
    mutation updateClient($id: ID!, $input: ClientUpdateInput!){
        updateClient(id: $id, input: $input){
            id
			firstName
			lastName
			company
			email
        }
    }
`

const EditClientForm = ({ client }) => {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const router = useRouter()

    const [updateClient, { loading }] = useMutation(UPDATE_CLIENT)

    const schema = yup.object().shape({
        firstName: yup
            .string()
            .required("Type the first name please"),
        lastName: yup
            .string()
            .required("Type the last name please"),
        email: yup
            .string()
            .required("Type the email please")
            .email("Type a valid email please"),
        company: yup
            .string()
            .required("Type the company name please"),
        telephone: yup
            .string()
            .required("Type the telephone number please")
    })

    const { handleSubmit, errors, setError, register } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            id: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            company: client.company,
            telephone: client.telephone
        }
    });

    const onSubmit = async (formData) => {
        try {
            const { data } = await updateClient({
                variables: {
                    id: client.id,
                    input: formData
                }
            })
            enqueueSnackbar(`Client successfully edited`, { variant: "success" })
            router.push('/clients')
        } catch (error) {
            if (error.message.includes('already registered')) {
                setError("email", { type: "validate", message: error.message })
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
                            Edit client
                        </Typography>
                        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First name"
                                name="firstName"
                                autoComplete="off"
                                autoFocus
                                inputRef={register}
                            />
                            {errors.firstName && <ErrorMessage message={errors.firstName.message} />}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label="Last name"
                                name="lastName"
                                autoComplete="off"
                                inputRef={register}
                            />
                            {errors.lastName && <ErrorMessage message={errors.lastName.message} />}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="off"
                                inputRef={register}
                            />
                            {errors.email && <ErrorMessage message={errors.email.message} />}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="company"
                                label="Company"
                                name="company"
                                autoComplete="off"
                                inputRef={register}
                            />
                            {errors.company && <ErrorMessage message={errors.company.message} />}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="telephone"
                                label="Telephone"
                                name="telephone"
                                autoComplete="off"
                                inputRef={register}
                                type="tel"
                            />
                            {errors.telephone && <ErrorMessage message={errors.telephone.message} />}

                            <Button
                                type={loading ? "button" : "submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Edit client
                    		</Button>
                        </form>
                    </div>
                </Container>
            </Grid>
        </>
    )
}

export default EditClientForm
