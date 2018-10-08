import React from 'react';
import ReactDOM from 'react-dom';
// Using react-router v3 here
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
// Import components from apollo libraries:
// Apollo Client is used for the Apollo Store which stored GraphQL data returned from queries client side.
import ApolloClient from 'apollo-client';
// Apollo Provider is the integration layer between the react app and apollo client.
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import SongList from './components/SongList';
import SongCreate from './components/SongCreate';

/* Create an instance of the Apollo Client and pass in a config object (if empty, the endpoint is assumed to be '/graphql')
   and set up automatically to connect to GraphQL on the back end through that route. */
const client = new ApolloClient({});


const Root = () => {
  return (
    // pass in the Apollo Client instance as a reference to the Apollo Store to the Apollo Provider
    // ***If using React-Router, then make sure the router is wrapped inside the Apollo Provider and not vice versa.
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={SongList} />
          <Route path="songs/new" component={SongCreate} />
        </Route>

      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
