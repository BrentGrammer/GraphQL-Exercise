import React from 'react';
import ReactDOM from 'react-dom';
// Import components from apollo libraries:
// Apollo Client is used for the Apollo Store which stored GraphQL data returned from queries client side.
import ApolloClient from 'apollo-client';
// Apollo Provider is the integration layer between the react app and apollo client.
import { ApolloProvider } from 'react-apollo';

import SongList from './components/SongList';

/* Create an instance of the Apollo Client and pass in a config object (if empty, the endpoint is assumed to be '/graphql')
   and set up automatically to connect to GraphQL on the back end through that route. */
const client = new ApolloClient({});

const Root = () => {
  return (
    // pass in the Apollo Client instance as a reference to the Apollo Store to the Apollo Provider
    <ApolloProvider client={client}>
      <SongList />
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
