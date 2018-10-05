/**
 * A Schema tells graphQL what type of data your working with and how it is arranged in the database; what properties are on each object (or fields in 
 * each table in the case of a relational database.)
 */
const axios = require('axios'); 
//const _ = require('lodash');

 // mock data store
 const users = [
   { id: '23', firstName: "Bill", age: 20 },
   { id: '27', firstName: "Jon", age: 37 }
 ];


// import the graphql library:
const graphql = require('graphql');
// get properties off the graphql library object to use:
const {
  GraphQLObjectType, // this is used to instruct graphql what properties an entity in your db has (i.e. what props are on a user, etc.)
  GraphQLString, // these are used to set the types of the properties to let graphql know what type they are.
  GraphQLInt,
  // GraphQLSchema is a helper that takes in a root query and returns a graphql schema instance
  GraphQLSchema
} = graphql;

// use GRaphQLObjectType to tell graphql what a user looks like - i.e. what properties is it supposed to have?
/* There are two required properties: 
    name - A string that describes the type being defined, usually the name of the type - by convention
    the name's first letter is capitalized.
    fields  - an object that defines and tells graphql the properties that an entity has.
*/
const UserType = new GraphQLObjectType({
  name: 'User',
  // set the type of each field in an object with a type property:
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

/* Root Query is the entry point for GraphQL into your db data - it points GraphQL to a starting point for getting related data
from the db */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // fields lists details on what type of data you can query GraphQL for
  fields: {
    user: {
      // if querying a user, type indicates what type will be returned - a UserType will be returned
      type: UserType,
      /* describes the arguments that are required for the user query (in this case the query needs an id param) and 
         specifies their shape and type. */
      args: { id: { type: GraphQLString } },
      // resolve is a resolver that defines the actual execution of the query to GraphQL to access the data:
      /* built in arguments are parentValue (not used often) and args - the arguments defined above.
        the args object will have any arguments specified in the args above */
      resolve(parentValue, args) {
        /* the resolver walks through the list of users from the store and finds the user node with the id = the id arg 
           required in the query. */
        return _.find(users, { id: args.id })
        // Note: return raw javascript objects or JSON in resolver and GraphQL will take care of typing and cpnversion behind the scenes.
        // If you return a promise in the resolver, then graphql detects that it is an asynchronous request automatically.
        // (Almost all fetching in a node app is going to be asynchronous so you return a promise usually)
      }
    }
  }
})

// builds a schema from the query passed in - takes an object with a query key; used here to build a schema based on the Root Query.
// export the result of the schema created to be accessible to the rest of your application.
module.exports = new GraphQLSchema({
  query: RootQuery
});