import React, { useEffect } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box, Grid, Typography } from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'

const GET_BEST_SELLER = gql`
    query getBestSellers {
        getBestSellers{
            seller {
                firstName
                lastName
                email
            }
            total
        }
    }
`

const BestSellersChart = () => {
    const { data, loading, startPolling, stopPolling } = useQuery(GET_BEST_SELLER)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])
    const bestSellersData = []

    if (!loading && data && data.getBestSellers) {
        data.getBestSellers.map((seller, index) => {
            bestSellersData[index] = {
                ...seller.seller[0],
                total: seller.total
            }
        })
    }

    return (
        <Grid container justify="center" alignItems="center" direction="column">
            <Box mb={5}>
                <Typography variant="h6" color="initial">Best Sellers</Typography>
            </Box>
            {!loading &&
                <ResponsiveContainer
                    height={550}
                    width={'99%'}
                >
                    <BarChart
                        width={700}
                        height={500}
                        data={bestSellersData}
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
