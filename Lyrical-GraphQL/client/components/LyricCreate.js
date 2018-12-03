import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class LyricCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ''
    };
  }

  onSubmit(event) {
    event.preventDefault();
    // call the mutation when form submitted
    this.props.mutate({
      variables: {
        content: this.state.content,
        songId: this.props.songId // passed from params in SongDetail.js (parent component)
      }
    }).then(() => {
      this.setState({ content: '' });
      // Note you can move this outside of the promise then block to instantly clear the field
      // As it is in here, the field will not be cleared until the query is completed which might take 
      // a small amount of time.
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>
          Add a Lyric
        </label>
        <input 
          value={this.state.content}
          onChange={event => this.setState({ content: event.target.value })} 
        />
      </form>
    );
  }
}

const mutation = gql`
  mutation AddLyricToSong($content: String, $songId: ID) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      lyrics {
        content
      }
    }
  }
`;

export default graphql(mutation)(LyricCreate);