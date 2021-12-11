import { createClient, dedupExchange, fetchExchange } from 'urql'
import { retryExchange } from '@urql/exchange-retry'

export const createGraphqlClient = () =>
  createClient({
    // url: 'http://localhost:9002/graphql',
    url: '/graphql',
    exchanges: [dedupExchange, retryExchange({}), fetchExchange],
    requestPolicy: 'cache-and-network',
  })
