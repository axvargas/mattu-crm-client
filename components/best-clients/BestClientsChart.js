import React, { useEffect } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box, Grid, Typography } from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'

const GET_BEST_CLIENTS = gql`
    query getBestClients{
        getBestClients{
            client{
                firstName
                lastName
                company
            }
            total
        }
    }
`


const BestSellersChart = () => {
    const { data, loading, startPolling, stopPolling } = useQuery(GET_BEST_CLIENTS)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])
    const bestClientsData = []

    if (!loading && data && data.getBestClients) {
        data.getBestClients.map((client, index) => {
            bestClientsData[index] = {
                ...client.client[0],
                total: client.total
            }
        })
    }

    return (
        <Grid container justify="center" alignItems="center" direction="column">
            <Box mb={5}>
                <Typography variant="h6" color="initial">Best Clients</Typography>
            </Box>
            {!loading &&
                <ResponsiveContainer
                    height={550}
                    width={'99%'}
                >
                    <BarChart
                        width={700}
                        height={500}
                        data={bestClientsData}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="firstName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            }
        </Grid>
    )
}

export default BestSellersChart
