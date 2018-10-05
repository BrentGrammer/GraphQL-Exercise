const express = require('express');
// require the express-graphql library as a compatibility layer b/w graphQL and Express:
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const app = express();

// Create Middleware to handle any requests that pass through the '/graphql' route with GraphQL:
// Pass expressGraphQL an options object that sets graphiql to true to use it as a development tool to test queries
// and also set the schema key to use the imported schema defined in /schema/schema.js:
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('listening on port 4000');
});