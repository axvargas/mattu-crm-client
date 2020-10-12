import React from 'react'
import { useRouter } from 'next/router'

import { useQuery, gql } from '@apollo/client'

import { useSnackbar } from 'notistack'
import Layout from '../layout/Layout'
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
const ProtectedInfo = ({ children }) => {
    const router = useRouter()
    const { data, loading, client } = useQuery(GET_AUTHENTICATED_USER)

    const { enqueueSnackbar } = useSnackbar()

    console.log(data)
    if (!loading) {
        if (data === undefined) {
            enqueueSnackbar("Not authorized, your session might have expired", { variant: 'error' })
            if (localStorage.getItem('token'))
                localStorage.removeItem("token")
            client.clearStore()
            router.push('/')
        }
    }

    return (
        <Layout>
            {loading || !data ?
                <Spinner />
                :
                <>
                    { children}
                </>
            }
        </Layout>
    )
}

export default ProtectedInfo
