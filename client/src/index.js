/**
 * You need to do this at the top of the index so the styled components work.
 * @todo Move this back to bootstrap.js
 */
import { install } from '@material-ui/styles';
install();

/**
 * Import React and ReactDOM for UI
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Import ApolloClient for graphQL support
 */
import { ApolloClient } from 'apollo-client';

/**
 * Import ApolloLink is used for combining links
 */
import { ApolloLink } from 'apollo-link';

/**
 * Import HttpLink for URI support with GraphQL
 */
import { HttpLink } from 'apollo-link-http';

/**
 * Import apollo-link-retry to retry GraphQL query or timeout if issue.
 */
import { RetryLink } from 'apollo-link-retry';

/**
 * Use Apollo's package for caching GraphQL queries. Improves performance.
 */
import { InMemoryCache } from 'apollo-cache-inmemory';

/**
 * Import anything from styles to make sure it works.
 */
import { makeStyles } from '@material-ui/styles';

/**
 * Error Handling on the application level.
 */
import { onError } from 'apollo-link-error';

/**
 * Get the App Component and Render it. This is your container component.
 */
import App from './components/App';
import { ApolloProvider } from 'react-apollo';

/**
 * Create a BASE_API_URL for queries.
 */
const BASE_API_URL = 'https://api.github.com/graphql';

/**
 * Create a base API link, used when creating ApolloClient.
 */
const httpLink = new HttpLink({
  uri: BASE_API_URL,
  headers: {
    authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`
  }
});

/**
 * Use Apollo's build in error management to categorically handle errors in the application.
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // Do something with the GraphQL error.
  }

  if (networkError) {
    // Do something with the network error.
  }
});

/**
 * Create a retry strategy. Default is 5 retries.
 */
const retryLink = new RetryLink();

/**
 * Combine your link streams. This is like middleware for Apollo.
 * The last one, httpLink, is a terminating query, which is stop further execution.
 * It should go last
 */
const link = ApolloLink.from([
  retryLink,
  errorLink,
  httpLink,
]);

/**
 * Create the Query cache.
 */
const cache = new InMemoryCache();

/**
 * Create the ApolloClient for handling GraphQL requests.
 * Pass the API link and cache
 */
const client = new ApolloClient({
  link,
  cache,
})

/**
 * Render the App, with an ApolloProvider wrapping it,
 * giving access to the ApolloClient and its methods.
 */
ReactDOM.render(
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>,
  document.getElementById('app')
);

/**
 * Hot module reloading.
 */
module.hot.accept();
