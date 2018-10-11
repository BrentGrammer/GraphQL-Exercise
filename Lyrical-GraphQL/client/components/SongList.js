import React, { Component } from 'react';
// This is used to bond the query to the component:
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';
import query from '../queries/fetchSongs';


class SongList extends Component {
  onSongDelete(id) {
    this.props.mutate({ variables: { id } })
      .then(() => {
        this.props.data.refetch()
      })
  }

  // create a helper method to iterate over the data returned from graphql and return a list
  renderSongs() {
    // song is desctructured to get the id and title for cleaner reading of code:
    return this.props.data.songs.map(({ id, title }) => {
      return (
        // traditionally you use the id of the model data you are fetching as the key in a React list
        <li key={id} className="collection-item">
          {title}
          <i className="material-icons" onClick={() => this.onSongDelete(id)}>
            delete
          </i>
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
      <div>
        <ul className="collection">
          {this.renderSongs()}
        </ul>
        <Link 
          to="/songs/new"
          className="btn-floating btn-large red right"
        >
          <i className="material-icons">add</i>
        </Link>
      </div>
    );
  }
}


const mutation = gql`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`;

/* graphql from react-apollo will create a data prop on the response object in props and this query defines what property
   the values requested will be in (in this case, this.props.data.songs).

   mutations will be accessible on props.mutate() and will not be automatically run by the graphql wrapper until that prop
   method is called.   
*/

// This uses the helper from react-apollo to bond the graphql query to the component.
// This will cause the query to be executed when the component is rendered to the screen.
// Note: if the same query is run in a refetch queries call, then Apollo will detect that and not re-run the same query passed here.
export default graphql(mutation)(
  graphql(query)(SongList)
);

// The above syntax is needed when multiple queries/mutations are called in the same component.  graphql can only handle one argument/query at a time.