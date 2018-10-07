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
  GraphQLSchema,
  GraphQLList, // used to wrap a type returned in a type definition to establish a one to many relationship.
  GraphQLNonNull // used for validation - wrap the type value with the new GraphQLNonNull() helper.
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
  // name is how you can reference the type in graphQL code (i.e. to create a fragment for it)
  name: 'Company',
  /* To resolve order of operations errors with circular references (two types reference each other), wrap the fields prop
     in an arrow function which returns the object of props/values. 
     This defines the function but does not execute it until after the entire file has executed and all consts are declared.
     This is leveraging closures and hoisting in Javascript so that the object will be returned by the function when fields 
     key is referenced in a query after all consts are defined.
  */
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString},
    description: { type: GraphQLString },
    // Adding this field links the relationship to the users entities and shows GraphQL how to get the users for the company:
    users: {
      // This sets up a ONE-TO-MANY Relationship;
      // Set the type to expect a returned LIST of user types by wrapping it in the library method GraphQLList():
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        /* using the parentValue arg pointing to current company instance, get the list of users from the API data 
           store assoc. with the company id. */
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(resp => resp.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  // set the type of each field in an object with a type property:
  fields: () => ({
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
  })
});


/* ============================
            ROOT QUERY
   ============================ */
   
/* Root Query is the entry point for GraphQL into your db data - it points GraphQL to a starting point for getting related data
from the db */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // fields lists details on what type of data you can query GraphQL for
  fields: {
    user: {
      // type is set to what type of data the resolve function returns:
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

/* =======================
          MUTATIONS
   ======================= */

   // define a root mutation which will contain the various mutation operations in the fields key:
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  // The name of the fields in a mutation should describe the kind of operation that is going to be executed:
  fields: {
   addUser: {
     // type refers to the type of data returned by the resolve function
     // Note: sometimes the type of data you're operating on and the type that is returned will not be the same.
     type: UserType,
     args: {
      firstName: { type: new GraphQLNonNull(GraphQLString) },
      age: { type: new GraphQLNonNull(GraphQLInt) },
      companyId: { type: GraphQLString }
     },
     // the args second argument is destructured (it contains the args defined above passed in with the query)
     resolve(parentValue, { firstName, age }) {
       // This is where you could access the database and query it using the args provided...
       return axios.post(`http://localhost:3000/users`, { firstName, age })
         .then(res => res.data);
     }
   },
   deleteUser: {
     type: UserType,
     args: {
       id: { type: new GraphQLNonNull(GraphQLString) }
     },
     resolve(parentValue, args) {
       return axios.delete(`http://localhost:3000/users/${args.id}`)
         .then(res => res.data);
     }
   },
   editUser: {
     type: UserType,
     args: {
       // Only the id is required to edit a user and the other args are optional
      id: { type: new GraphQLNonNull(GraphQLString ) },
      firstName: { type: GraphQLString },
      age: { type: GraphQLInt },
      companyId: { type: GraphQLString }
     },
     resolve(parentValue, args) {
       // Note: args will contain any parameters set, so just pass it in directly as the object for the response body:
       axios.patch(`http://localhost:3000/users/${args.id}`, args)
         .then(res => res.data);
     }
   }
  }
});

// builds a schema from the root query passed in - takes an object with a query key; used here to build a schema based on the Root Query.
// export the result of the schema created to be accessible to the rest of your application.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});