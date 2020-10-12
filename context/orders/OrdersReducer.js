import {
    SELECT_CLIENT,
    SELECT_PRODUCTS,
    QUANTITY_PRODUCTS,
    UPDATE_TOTAL,
    ERROR,
    NO_ERROR
} from './types'

const OrdersReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case SELECT_CLIENT:
            return {
                ...state,
                client: payload
            }
        case SELECT_PRODUCTS:
            return {
                ...state,
                products: payload
            }
        case QUANTITY_PRODUCTS:
            return {
                ...state,
                products: state.products.map((product) => product.id === payload.id ? payload : product)
            }
        case UPDATE_TOTAL:
            return {
                ...state,
                total: state.products.reduce((newTotal, product) => newTotal += product.price * product.quantity, 0)
            }
        case ERROR:
            return {
                ...state,
                error: true
            }
        case NO_ERROR:
            return {
                ...state,
                error: null
            }
        default:
            return {
                ...state
            }
    }
}

export default OrdersReducer