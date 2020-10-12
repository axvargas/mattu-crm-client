import React, { useEffect, useContext } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import {
    Box,
    TextField,
    CircularProgress
} from "@material-ui/core"

import Autocomplete from '@material-ui/lab/Autocomplete'

import OrdersContext from '../../../context/orders/OrdersContext'

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

const SelectClient = () => {
    const { loading, data } = useQuery(GET_CLIENTS_BY_SELLER)

    const { client, selectClientFn } = useContext(OrdersContext)

    return (
        <Box mt={2}>
            <Autocomplete
                options={data ? data.getClientsBySeller : []}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                id="autocomplete-clients"
                value={client}
                onChange={(event, newValue) => {
                    selectClientFn(newValue);
                }}
                getOptionSelected={(option, value) => option.id === value.id}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select a client"
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="secondary" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        </Box>
    )
}

export default SelectClient
