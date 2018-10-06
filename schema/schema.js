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

/* ==========================
          DEFINE TYPES
   ========================== */

// use GRaphQLObjectType to tell graphql what a user or other object fetched looks like - i.e. what properties is it supposed to have?
/* 
    There are two required properties when using GraphQLObjectType to define a type: 
    name - A string that describes the type being defined, usually the name of the type - by convention
    the name's first letter is capitalized.
    fields  - an object that defines and tells graphql the properties that an entity has.
*/

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString},
    description: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  // set the type of each field in an object with a type property:
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // add company as a field to create an association/relation of the UserType to the CompanyType:
    company: {
      // define the type of data that is received when querying for this associated field:
      type: CompanyType,
      // use resolver function to get the company info based on the company id that is on the user entry
      // The companyId on the user that you can use to get the company entry will be in the parentValue argument - it will be the user that was fetched and have the companyId on it you can use.
      resolve(parentValue, args) {
        //console.log(parentValue)
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(resp => resp.data);
      }
    }
  }
});

/* Root Query is the entry point for GraphQL into your db data - it points GraphQL to a starting point for getting related data
from the db */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // fields lists details on what type of data you can query GraphQL for
  fields: {
    user: {
      // if querying a user, type indicates what type will be returned - a UserType will be returned with associated fields available
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
        //return _.find(users, { id: args.id }) // <-- this was a synchronous request using lodash to get static data

        // Asynchronous request using axios:
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data); // <-- axios returns a data key with the resp data in it - this is to par it down so whatever then is attached to this returned promise will be able to just access the data directly from the nested data prop.

        // Note: return raw javascript objects or JSON in resolver and GraphQL will take care of typing and cpnversion behind the scenes.
        // If you return a promise in the resolver, then graphql detects that it is an asynchronous request automatically.
        // (Almost all fetching in a node app is going to be asynchronous so you return a promise usually)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
})

// builds a schema from the query passed in - takes an object with a query key; used here to build a schema based on the Root Query.
// export the result of the schema created to be accessible to the rest of your application.
module.exports = new GraphQLSchema({
  query: RootQuery
});