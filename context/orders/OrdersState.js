import React, { useReducer } from 'react'
import OrdersContext from './OrdersContext'
import OrederReducer from './OrdersReducer'
import {
    SELECT_CLIENT,
    SELECT_PRODUCTS,
    QUANTITY_PRODUCTS,
    UPDATE_TOTAL,
    ERROR,
    NO_ERROR
} from './types'

const OrdersState = ({ children }) => {
    const initialState = {
        client: null,
        products: [],
        total: 0,
        error: null
    }

    const [state, dispatch] = useReducer(OrederReducer, initialState)

    const selectClientFn = (client) => {
        dispatch({
            type: SELECT_CLIENT,
            payload: client
        })
        console.log(client);
    }

    const selectProductsFn = (products) => {
        dispatch({
            type: SELECT_PRODUCTS,
            payload: products
        })
    }

    const quantityProductsFn = (newProduct) => {
        dispatch({
            type: QUANTITY_PRODUCTS,
            payload: newProduct
        })
    }

    const updateTotalFn = () => {
        console.log("Update");
        dispatch({
            type: UPDATE_TOTAL
        })
    }

    const errorFn = () => {
        dispatch({
            type: ERROR
        })
    }

    const noErrorFn = () => {
        dispatch({
            type: NO_ERROR
        })
    }

    return (
        <OrdersContext.Provider
            value={{
                client: state.client,
                products: state.products,
                total: state.total,
                error: state.error,

                selectClientFn,
                selectProductsFn,
                quantityProductsFn,
                updateTotalFn,
                errorFn,
                noErrorFn
            }}
        >
            {children}
        </OrdersContext.Provider>
    )
}

export default OrdersState
