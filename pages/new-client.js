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

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { makeStyles } from '@material-ui/core/styles'

import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers'
import * as yup from "yup"

import { useQuery, useMutation, gql } from '@apollo/client'

import Layout from '../components/layout/Layout'
import ErrorMessage from '../components/ErrorMessage'
import Spinner from '../components/spinner'

import { useSnackbar } from 'notistack';

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

const GET_AUTHENTICATED_USER = gql`
    query getAuthenticatedUser{
        getAuthenticatedUser{
            id
            firstName
            lastName
            email
        }
    }
`

const CREATE_CLIENT = gql`
    mutation createClient($input: ClientInput!){
        createClient(input: $input){
            id
            firstName
            lastName
            email
            company
            telephone
        }
    }
`
const GET_CLIENTS_BY_SELLER = gql`
	query getClientsBySeller {
		getClientsBySeller{
			firstName
			lastName
			company
			email
		}
	}
`
const NewClient = () => {
    // * Using useMutation hook
    const [createClient, { loading }] = useMutation(CREATE_CLIENT, {
        // ? Qhat is createClient -> It is the first object that comes with the CREATE_CLIENT mutation, it contains the new client
        update(cache, { data: { createClient } }) {
            try {
                // * Get cache object we want to update 
                const { getClientsBySeller } = cache.readQuery({ query: GET_CLIENTS_BY_SELLER })

                if (getClientsBySeller) {
                    // * REWRITE theactual cache with the new one
                    // ! DO NOT MODIFY IT
                    cache.writeQuery({
                        query: GET_CLIENTS_BY_SELLER,
                        data: {
                            getClientsBySeller: [...getClientsBySeller, createClient]
                        }
                    })
                }
            } catch (error) {
                console.log("Nothing in cache")

                cache.writeQuery({
                    query: GET_CLIENTS_BY_SELLER,
                })
            }
        }
    })

    const { data, loading: ldg, client } = useQuery(GET_AUTHENTICATED_USER)

    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar();

    const classes = useStyles()

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
        mode: 'onBlur'
    });

    const onSubmit = async (formData) => {
        try {
            const { data } = await createClient({
                variables: {
                    input: formData
                }
            })
            enqueueSnackbar(`Client successfully created`, { variant: "success" })
            router.push('/clients')
        } catch (error) {
            if (error.message.includes('already registered')) {
                setError("email", { type: "validate", message: error.message })
            } else {
                enqueueSnackbar(error.message, { variant: "error" })
            }
        }
    }


    if (data) {
        if (data.getAuthenticatedUser === null) {
            enqueueSnackbar("Not authorized, your session might have expired", { variant: 'error' })
            if (localStorage.getItem('token'))
                localStorage.removeItem("token")
            client.clearStore()
            router.push('/')
        }
    }

    return (
        <Layout>
            {ldg || loading || !data.getAuthenticatedUser ?
                <Spinner />
                :
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
                                    <PersonAddIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    New Client
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
                                        Create new client
                    		</Button>
                                </form>
                            </div>
                        </Container>
                    </Grid>
                </>
            }
        </Layout>
    )
}

export default NewClient
