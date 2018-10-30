import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import fetchSong from '../queries/fetchSong';

class SongDetail extends Component {

  render() {
    console.log(this.props)
    return (
      <div>
        <h3>song detail</h3>
      </div>
    );
  }
}

// To pass query vars from the component to use in a named query, intercept the props object in the graphql wrapper helper and 
// access them in the second argument object options property of the first graphql call.  The props injected and props on the component
// are exactly the same object with access to the same data.
// The object returned by the options function will be provided to the query when it is made.
export default graphql(fetchSong, {
  options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);