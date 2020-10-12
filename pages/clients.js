import React, { useState } from 'react';
import { useRouter } from 'next/router'
import Layout from '../components/layout/Layout'
import { gql, useMutation, useQuery } from '@apollo/client'
import Spinner from '../components/spinner'
import MUIDataTable from "mui-datatables"
import { useSnackbar } from 'notistack'

import CustomToolbar from '../components/CustomToolbar'
import CustomToolbarSelect from '../components/CustomToolbarSelect'
import ConfirmationDialog from '../components/ConfirmationDialog'

import Router from 'next/router'
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

const GET_CLIENTS_BY_SELLER = gql`
	query getClientsBySeller {
		getClientsBySeller{
			id
			firstName
			lastName
			company
			email
		}
	}
`

const DELETE_CLIENT = gql`
	mutation deleteClient($id: ID!){
		deleteClient(id: $id)
	}
`


const Clients = () => {
	const [open, setOpen] = useState(false)
	const [selectedClient, setSelectedClient] = useState(null)
	const [goAhead, setGoAhead] = useState(true)
	// * Apollo query
	const { data: dta, loading: ldg, client } = useQuery(GET_AUTHENTICATED_USER)

	const [deleteClient, obj] = useMutation(DELETE_CLIENT, {
		update(cache) {
			try {
				// * Get cache object we want to update 
				const { getClientsBySeller } = cache.readQuery({ query: GET_CLIENTS_BY_SELLER })
				// * REWRITE theactual cache with the new one
				// ! DO NOT MODIFY IT
				cache.evict({ broadcast: false });
				cache.writeQuery({
					query: GET_CLIENTS_BY_SELLER,
					data: {
						getClientsBySeller: getClientsBySeller.filter((client) => client.id !== selectedClient.id)
					}
				})
			} catch (error) {
				cache.writeQuery({
					query: GET_CLIENTS_BY_SELLER,
				})
			}
		}
	})


	const { data, loading, error } = useQuery(GET_CLIENTS_BY_SELLER, {
		skip: goAhead
	})



	const { enqueueSnackbar } = useSnackbar()

	const router = useRouter()

	const handleDelete = (selectedRows, displayData, setSelectedRows) => {
		const index = selectedRows.data[0].dataIndex
		const { data } = displayData.find((element) => element.dataIndex === index)
		const client = {
			id: data[0],
			firstName: data[1],
			lastName: data[2],
			email: data[3],
			company: data[4],
			telephone: data[5]
		}
		setSelectedRows([])
		setSelectedClient(client)
		setOpen(true)
	}

	const handleDeleteClient = async () => {
		try {
			const { data } = await deleteClient({
				variables: {
					id: selectedClient.id
				}
			})
			enqueueSnackbar(data.deleteClient, { variant: 'success' })
			setOpen(false)
			setSelectedClient(null)
		} catch (error) {
			console.log(error)
			enqueueSnackbar(error.message, { variant: 'error' })
		}

	}
	const handleEdit = (selectedRows, displayData) => {
		const index = selectedRows.data[0].dataIndex
		const { data } = displayData.find((element) => element.dataIndex === index)
		const id = data[0]
		Router.push({
			pathname: "/edit-client/[id]",
			query: { id: id }
		})
	}

	const handleCancel = () => {
		setOpen(false)
	}
	const columns = [
		{
			name: "id",
			label: "ID",
			options: {
				display: false,
				filter: false,
				sort: false,
			}
		},
		{
			name: "firstName",
			label: "First name",
			options: {
				filter: true,
				sort: true,
			}
		},
		{
			name: "lastName",
			label: "Last name",
			options: {
				filter: true,
				sort: true,
			}
		},
		{
			name: "company",
			label: "Company",
			options: {
				filter: true,
				sort: true,
			}
		},
		{
			name: "email",
			label: "Email",
			options: {
				filter: true,
				sort: true,
			}
		},
	]
	const options = {
		filter: false,
		selectableRows: 'single',
		customToolbar: () => (
			<CustomToolbar btnDescription="New client" addNewSth={goToNewClient} />
		),
		customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
			<CustomToolbarSelect handleEdit={handleEdit} handleDelete={handleDelete} selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} />
		)
	}


	if (dta) {
		if (dta.getAuthenticatedUser === null) {
			enqueueSnackbar("Not authorized, your session might have expired", { variant: 'error' })
			if (localStorage.getItem('token'))
				localStorage.removeItem("token")
			client.clearStore()
			router.push('/')
		} else if (dta.getAuthenticatedUser !== null && goAhead === true) {
			setGoAhead(false)
		}
	}

	const goToNewClient = () => {
		router.push('/new-client')
	}
	return (
		<Layout>
			{ldg || !dta.getAuthenticatedUser || !data || loading ?
				<Spinner />
				:
				<>
					<MUIDataTable
						title={"Clients"}
						data={data.getClientsBySeller}
						columns={columns}
						options={options}
					/>
					{open &&
						< ConfirmationDialog
							open={open}
							handleCancel={handleCancel}
							handleDelete={handleDeleteClient}
							title="Are you sure you want to delete this client?"
							message={<>The client <b>{selectedClient.firstName} {selectedClient.lastName}</b> will be permenently deleted and will be impossible to be recovered</>}
							loading={obj.loading}
						/>
					}
				</>
			}
		</Layout>
	)
}

export default Clients