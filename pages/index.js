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
    InputAdornment,
    IconButton,
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


const AUTHENTICATE_USER = gql`
    mutation authenticateUser($input: AuthInput!){
        authenticateUser(input: $input){
            token
        }
    }
`

const SignIn = () => {
    // * Using useMutation hook
    const [authenticateUser, { loading, client }] = useMutation(AUTHENTICATE_USER)

    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar();

    const classes = useStyles()
    const [showPassword, setShowPassword] = useState(false);

    const schema = yup.object().shape({
        email: yup
            .string()
            .required("Type your email please")
            .email("Type a valid email please"),
        password: yup.string().required("Type your password please")
    })

    const { handleSubmit, errors, setError, register } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (formData) => {
        client.clearStore()
        localStorage.removeItem('token')
        const { email, password } = formData
        try {
            const { data } = await authenticateUser({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            })
            const { token } = data.authenticateUser
            localStorage.setItem('token', token)
            enqueueSnackbar(`Successfully signed in`, { variant: "success" })
            router.push('/clients')
        } catch (error) {
            if (error.message.includes('user')) {
                setError("email", { type: "validate", message: error.message })
            } else if (error.message.includes('password')) {
                setError("password", { type: "validate", message: error.message })
            } else {
                enqueueSnackbar(error.message, { variant: "error" })
            }
        }
    }

    const handleClickShowPassword = (event) => {
        event.preventDefault()
        setShowPassword(!showPassword)
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
                            Sign in
                            </Typography>
                        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                inputRef={register}
                            />

                            {errors.email && <ErrorMessage message={errors.email.message} />}
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                inputRef={register}
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
                            {errors.password && <ErrorMessage message={errors.password.message} />}
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type={loading ? "button" : "submit"}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                    		</Button>
                            <Grid container>
                                <Grid item xs>
                                    {/* <Link href="/forgot-password"> */}
                                Forgot password?
                            {/* </Link> */}
                                </Grid>
                                <Grid item>
                                    <Link href="/sign-up">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Container>
            </Grid>
        </Layout>
    );
}

export default SignIn