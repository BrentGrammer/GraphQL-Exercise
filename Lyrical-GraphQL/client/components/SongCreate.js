import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import query from '../queries/fetchSongs';


class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: ''
    };
  }

  onSubmit(event) {
    /* The flow of this update mutation is: 1) mutation run, 2) getsongs refetched 3) user redirected to list page */
    event.preventDefault();
    // mutations will have access to props.mutate() which takes a config object with a variables prop:
    this.props.mutate({
      // this is where you define query variables for the mutation:
      variables: { title: this.state.title },
      /* this is builtin to solve the problem in Apollo of re-rendering a list after a mutation (normally Apollo will not 
          re-run the query to fetch the updated list of data to display.) 
         refetchQueries takes an array of queries that will be run after the mutation successfully completes.
         There are two props on the objects passed in: query: and variables: */
      refetchQueries: [{ query }]
    })
    // props.mutate() returns a promise that you can chain a .then to for actions after the mutation is complete:
    .then(() => {
      // this redirects the user after the song is created to the songs list index page:
      hashHistory.push('/')
    });
  }
  
  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Enter Song Title: </label>
          <input 
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
    </div>
    );
  }
}

// Use query variables to get the form data from the component to use in the mutation query:
// The query variables are defined in the onSubmit method in the variables prop on the config object passed into props.mutate()
const mutation = gql`
mutation AddSong($title: String) {
  addSong(title: $title) {
    title
  }
}
`;
// When passing in a mutation to graphql wrapper, instead of props.data, you get access in the component to props.mutate
// props.mutate is a function and when called, it will run the mutation defined and passed in.
export default graphql(mutation)(SongCreate);
