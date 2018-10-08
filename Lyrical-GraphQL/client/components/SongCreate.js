import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';



class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: ''
    };
  }

  onSubmit(event) {
    event.preventDefault();
    // mutations will have access to props.mutate() which takes a config object with a variables prop:
    this.props.mutate({
      // this is where you define query variables for the mutation:
      variables: {
        title: this.state.title
      }
    });
  }
  
  render() {
    return (
      <div>
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
