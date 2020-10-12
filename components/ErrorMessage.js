import React from 'react'
import { Box } from '@material-ui/core'

const ErrorMessage = ({ message, mt }) => {
    return (
        <Box
            mt={mt || 0}
            color="#db3434"
            bgcolor="#fff5f5"
            p={1.5}
            boxShadow={2}
            borderLeft={5}
            borderColor="#db3434"
            borderRadius={5}
            display="flex"
        >
            {message}
        </Box>
    )
}

export default ErrorMessage
