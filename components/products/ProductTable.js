import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Router from 'next/router'

import { useQuery, useMutation, gql } from '@apollo/client'

import MUIDataTable from 'mui-datatables'
import Spinner from '../spinner'
import CustomToolbar from '../CustomToolbar'
import CustomToolbarSelect from '../CustomToolbarSelect'
import ConfirmationDialog from '../ConfirmationDialog'

import { useSnackbar } from 'notistack'

const GET_ALL_PRODUCTS = gql`
    query getAllProducts{
        getAllProducts {
            id
            name
            price
            stock
            createdAt
        }
    }
`

const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!){
        deleteProduct(id: $id)
    }
`

const ProductTable = () => {
    const [open, setOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const { data, loading, error } = useQuery(GET_ALL_PRODUCTS)

    const [deleteProduct, { loading: ldg }] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            try {
                // * Get cache object we want to update 
                const { getAllProducts } = cache.readQuery({ query: GET_ALL_PRODUCTS })
                // * REWRITE theactual cache with the new one
                // ! DO NOT MODIFY IT
                cache.evict({ broadcast: false });
                cache.writeQuery({
                    query: GET_ALL_PRODUCTS,
                    data: {
                        getAllProducts: getAllProducts.filter((product) => product.id !== selectedProduct.id)
                    }
                })
            } catch (error) {
                cache.writeQuery({
                    query: GET_ALL_PRODUCTS,
                })
            }
        }
    })

    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()

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
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "stock",
            label: "Stock",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "price",
            label: "Price",
            options: {
                filter: true,
                sort: true,
            }
        }
    ]

    const options = {
        filter: false,
        selectableRows: 'single',
        customToolbar: () => (
            <CustomToolbar btnDescription="New Product" addNewSth={goToNewProduct} />
        ),
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomToolbarSelect handleEdit={handleEdit} handleDelete={handleClickDelete} selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} />
        )
    }

    const goToNewProduct = () => {
        router.push('/new-product')
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const handleClickDelete = (selectedRows, displayData, setSelectedRows) => {
        const index = selectedRows.data[0].dataIndex
        const { data } = displayData.find((element) => element.dataIndex === index)
        const product = {
            id: data[0],
            name: data[1],
            stock: data[2],
            price: data[3]
        }
        setSelectedRows([])
        setSelectedProduct(product)
        setOpen(true)
    }

    const handleEdit = (selectedRows, displayData) => {
        const index = selectedRows.data[0].dataIndex
        const { data } = displayData.find((element) => element.dataIndex === index)
        const id = data[0]
        Router.push({
            pathname: "/edit-product/[id]",
            query: { id: id }
        })
    }

    const handleDeleteProduct = async () => {
        try {
            const { data } = await deleteProduct({
                variables: {
                    id: selectedProduct.id
                }
            })
            enqueueSnackbar(data.deleteProduct, { variant: 'success' })
            setOpen(false)
            setSelectedProduct(null)
        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    return (
        <>
            { loading || !data.getAllProducts ?
                <Spinner />
                :
                <>
                    <MUIDataTable
                        title={"Products"}
                        data={data.getAllProducts}
                        columns={columns}
                        options={options}
                    />
                    {open &&
                        < ConfirmationDialog
                            open={open}
                            handleCancel={handleCancel}
                            handleDelete={handleDeleteProduct}
                            title="Are you sure you want to delete this product?"
                            message={<>The product <b>{selectedProduct.name}</b> will be permenently deleted and will be impossible to be recovered</>}
                            loading={ldg}
                        />
                    }
                </>
            }
        </>
    )
}

export default ProductTable
