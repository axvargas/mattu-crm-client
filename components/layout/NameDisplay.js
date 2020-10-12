import React from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { Box, Button, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack';

import Spinner from '../spinner'
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

const NameDisplay = () => {
    const { data, loading, client } = useQuery(GET_AUTHENTICATED_USER)
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar();

    const signOut = () => {
        localStorage.removeItem('token')
        client.clearStore()
        enqueueSnackbar(`Successfully signed out`, { variant: "success" })
        router.push('/')
    }

    return (
        <>
            {loading || !data || !data.getAuthenticatedUser ?
                <Typography variant="body2" color="initial">Loading...</Typography>
                :
                <>
                    <Box
                        border={2}
                        borderColor="secondary.main"
                        borderRadius={10}
                        p={1}
                        px={2}
                        // boxShadow={3}
                        fontWeight="fontWeightMedium"
                        fontSize={14}
                        mr={2}
                        bgcolor='#38b2ac38'
                    >
                        {data.getAuthenticatedUser.firstName}
                    </Box>
                    <Button variant="contained" color="secondary" onClick={signOut}>
                        Sign out
                    </Button>
                </>
            }
        </>

    )
}

export default NameDisplay
