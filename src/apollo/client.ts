import { ApolloClient, InMemoryCache } from '@apollo/client';

export const dibsClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/spsina/dibsramses',
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
});
