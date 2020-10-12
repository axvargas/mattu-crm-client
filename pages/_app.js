import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';

import { ApolloProvider } from '@apollo/client'
import client from '../config/apollo'

import OrdersState from '../context/orders/OrdersState'
export default function MyApp(props) {
	const { Component, pageProps } = props;


	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>Mattu-CRM</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			<ApolloProvider client={client} >
				<ThemeProvider theme={theme}>
					<SnackbarProvider maxSnack={3}>
						<OrdersState>
							{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
							<CssBaseline />
							<Component {...pageProps} />
						</OrdersState>
					</SnackbarProvider>
				</ThemeProvider>
			</ApolloProvider>
		</React.Fragment>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};