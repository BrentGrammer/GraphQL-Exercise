import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import fetchSong from '../queries/fetchSong';
import LyricCreate from './LyricCreate';


class SongDetail extends Component {

  render() {
    // the song property will be on the data object returned and set by graph ql:
    const { song } = this.props.data;

    // Always check if the data has been returned from GraphQL - can check the item on props.data or props.data.loading:
    // Note you can also return an empty div if the loading message flashes too quickly.
    if (!song) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <Link to="/">Back</Link>
        <h3>{song.title}</h3>
        {/* id from react-router params must be passed down to use as a query variable because react-router only
            passes props to the first top level component rendered - LyricCreate is rendered by this component */}
        <LyricCreate songId={this.props.params.id} />
      </div>
    );
  }
}

// To pass query vars from the component to use in a named query, intercept the props object in the graphql wrapper 
// helper and 
// access them in the second argument object options property of the first graphql call.  The props injected and 
// props on the component
// are exactly the same object with access to the same data.
// The object returned by the options function will be provided to the query when it is made.
// params is a react-router prop which is used to access the song id in the url route query parameters.
export default graphql(fetchSong, {
  options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);