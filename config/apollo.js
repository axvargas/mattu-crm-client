import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: 'https://mattu-crm-graphql.herokuapp.com',
    fetch
})

const authLink = setContext((_, { headers }) => {
    // * Read token storaged
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})
const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache,
    link: authLink.concat(httpLink)
})

export default client

// ? In case you are not using your own authentication, this is the simplest config
// import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
// import fetch from 'node-fetch'

// const client = new ApolloClient({
//     connectToDevTools: true,
//     cache: new InMemoryCache,
//     link: new HttpLink({
//         uri: 'http://localhost:4000/',
//         fetch
//     })
// })

// export default client