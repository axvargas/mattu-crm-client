import React from 'react'
import { useRouter } from 'next/router'

import { useQuery, useMutation, gql } from '@apollo/client'
import { CssBaseline } from '@material-ui/core'
import MUIDataTable from 'mui-datatables'
import Spinner from '../spinner'
import CustomToolbar from '../CustomToolbar'

import Order from './Order'

const GET_ORDER_BY_SELLER = gql`
    query getOrderBySeller{
        getOrderBySeller{
            id
            order {
                id
                quantity
                name
            }
            client {
                id
                firstName
                lastName
                email
                telephone
            }
            seller
            total
            state
        }
    }
`



const OrderTable = () => {

    const { data, loading } = useQuery(GET_ORDER_BY_SELLER)


    const router = useRouter()

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
            name: "order",
            label: "Order",
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: "client",
            label: "Client",
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: "seller",
            label: "Seller",
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: "total",
            label: "Total",
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: "state",
            label: "State",
            options: {
                filter: true,
                sort: true,
            }
        }
    ]

    const options = {
        selectableRows: 'single',
        selectableRowsOnClick: true,
        customToolbar: () => (
            <CustomToolbar btnDescription="New Order" addNewSth={goToNewOrder} />
        ),
        customRowRender: data => {
            return (
                <tr key={data[0]}>
                    <td colSpan={6}>
                        <Order
                            data={data}
                        />
                    </td>
                </tr>
            );
        },
    }

    const goToNewOrder = () => {
        router.push('/new-order')
    }


    return (
        <>
            { loading || !data.getOrderBySeller ?
                <Spinner />
                :
                <>
                    <CssBaseline />
                    <MUIDataTable
                        title={"Orders"}
                        data={data.getOrderBySeller}
                        columns={columns}
                        options={options}
                    />
                </>
            }
        </>
    )
}

export default OrderTable
