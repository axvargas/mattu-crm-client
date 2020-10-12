import React from 'react'
import { useRouter } from 'next/router'

import { useQuery, gql } from '@apollo/client'

import { useSnackbar } from 'notistack';

import Layout from '../../components/layout/Layout'
import Spinner from '../../components/spinner'
import EditClientForm from '../../components/editClient/EditClientForm'


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
const GET_CLIENT_BY_ID = gql`
    query getClientById($id: ID!){
        getClientById(id: $id){
            id
            firstName
            lastName
            email
            company
            telephone
        }
    }
`

const EditClient = () => {
    const router = useRouter()
    const { query: { id } } = router

    const { data, loading, client } = useQuery(GET_AUTHENTICATED_USER)

    const { data: dt, loading: ldng } = useQuery(GET_CLIENT_BY_ID, {
        variables: {
            id
        },
    })

    const { enqueueSnackbar } = useSnackbar()

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
            {loading || ldng || !data.getAuthenticatedUser || !dt.getClientById ?
                <Spinner />
                :
                <EditClientForm client={dt.getClientById} />
            }
        </Layout>
    )
}

export default EditClient
