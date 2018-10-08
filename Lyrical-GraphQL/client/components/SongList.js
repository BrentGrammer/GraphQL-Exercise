import React, { Component } from 'react';
// The graphql-tag library aids in constructing grapql queries client-side.
import gql from 'graphql-tag';
// This is used to bond the query to the component:
import { graphql } from 'react-apollo';

class SongList extends Component {

  // create a helper method to iterate over the data returned from graphql and return a list
  renderSongs() {
    return this.props.data.songs.map(song => {
      return (
        // traditionally you use the id of the model data you are fetching as the key in a React list
        <li key={song.id} className="collection-item">
          {song.title}
        </li>
      );
    });
  }

  render() {
    // Since the query execution is asynchronous, you need to handle the case when the component renders, the data will
    // not be present - use the loading flag on all query props objects which is a boolean to make a conditional to prevent
    // the component from trying to render data that is not present:
    if (this.props.data.loading) { return <div>Loading...</div>; }

    return (
      <ul className="collection">
        {this.renderSongs()}
      </ul>
    );
  }
}

/* graphql from react-apollo will create a data prop on the response object in props and this query defines what property
   the values requested will be in (in this case, this.props.data.songs): */
const query = gql`
  {
    songs {
      id
      title
    }
  }
`;

// This uses the helper from react-apollo to bond the graphql query to the component.
// This will cause the query to be executed when the component is rendered to the screen.
export default graphql(query)(SongList);