// The graphql-tag library aids in constructing grapql queries client-side.
import gql from 'graphql-tag';

export default gql`
{
  songs {
    id
    title
  }
}
`;