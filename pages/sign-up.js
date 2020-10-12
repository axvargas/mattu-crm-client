import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
    Container,
    Typography,
    IconButton,
    InputAdornment,
    Backdrop
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles'

import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers'
import * as yup from "yup"

import { useMutation, gql } from '@apollo/client'

import Layout from '../components/layout/Layout'
import Copyright from '../components/Copyright'
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
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        position: 'relative',
        paddingBottom: theme.spacing(2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 20,
    },
}));


const CREATE_USER = gql`
    mutation createUser($input: UserInput!) {
        createUser(input: $input) {
            id
            firstName
            lastName
            email
            createdAt
        }
    }
`


const SignUp = () => {
    // * Using useMutation hook
    const [createUser, { loading }] = useMutation(CREATE_USER)

    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar();

    const classes = useStyles()
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    const schema = yup.object().shape({
        firstName: yup
            .string()
            .required("Type your first name"),
        lastName: yup
            .string()
            .required("Type your last name"),
        email: yup
            .string()
            .required("Type your email please")
            .email("Type a valid email please"),
        password: yup
            .string()
            .required("Type the password please")
            .min(6, "The password must be  minimun 6 characters length")
            .max(12, "The password must be  maximun 6 characters length"),
        passwordConfirmation: yup
            .string()
            .required("Type the password confirmation please")
            .oneOf([yup.ref("password"), null], "Passwords must match")
    });

    const { handleSubmit, errors, setError, register } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur"
    });

    const onSubmit = async (formData) => {
        const { firstName, lastName, email, password } = formData
        try {
            const { data } = await createUser({
                variables: {
                    input: {
                        firstName,
                        lastName,
                        email,
                        password
                    }
                }
            })
            enqueueSnackbar(`${data.createUser.firstName} was successfully created`, { variant: "success" });
            router.push('/')
        } catch (error) {
            setError("email", { type: "validate", message: error.message })
        }
    }


    const handleClickShowPassword = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    };

    const handleClickShowPasswordConfirmation = (event) => {
        event.preventDefault();
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
        <Layout>
            <Backdrop className={classes.backdrop} open={loading}>
                <Spinner />
            </Backdrop>
            <Grid container justify="center" alignItems="center" direction="column" style={{ minHeight: '100vh' }}>
                <Container maxWidth="xs" className={classes.container}
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
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                </Typography>
                        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        inputRef={register}
                                    />
                                    {errors.firstName && <ErrorMessage mt={1} message={errors.firstName.message} />}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        inputRef={register}
                                    />
                                    {errors.lastName && <ErrorMessage mt={1} message={errors.lastName.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        inputRef={register}
                                    />
                                    {errors.email && <ErrorMessage mt={1} message={errors.email.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        inputRef={register}
                                        type={showPassword ? "text" : "password"}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleClickShowPassword}>
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {errors.password && <ErrorMessage mt={1} message={errors.password.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="passwordConfirmation"
                                        label="Password confirmation"
                                        type="password"
                                        id="passwordConfirmation"
                                        autoComplete="current-password"
                                        inputRef={register}
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleClickShowPasswordConfirmation}>
                                                        {showPasswordConfirmation ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {errors.passwordConfirmation && <ErrorMessage mt={1} message={errors.passwordConfirmation.message} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type={loading ? "button" : "submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign Up
                    </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="/">
                                        Already have an account? Sign in
                            </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </Container>
            </Grid>
        </Layout>
    );
}

export default SignUp