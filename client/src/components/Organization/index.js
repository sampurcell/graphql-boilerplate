/**
 * Even though it's a stateless, functional component, you still need react for the JSX
 */
import React from 'react';

/**
 * Import GraphQL and Apollo things for help making GraphQL queries.
 */
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Define your GraphQL query for this view.
 * There is a fragmenet used here. You add it with a template lteral,
 * then you use the fragment with the spread operator.
 *
 * Very similar to user profile, except we are getting repositories for an organization,
 * rather than for a specific user.
 */
const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query(
    $organizationName: String!,
    $cursor: String
  ) {
    organization(login: $organizationName) {
      repositories(
        first: 5,

        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

/**
 * Import application components
 */
import ErrorMessage from '../Error';
import Loading from '../Loading';

/**
 * Import a GraphQL fragment that will be used to get part of the information.
 * Import RepositoryList to get the FetchMore functionality there.
 */
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';

/**
 * Placeholder for organizaiton.
 * Notice the new skip prop. It tells query not to query if the field is empty in this case.
 *
 * @todo - Read about the render props, where do data, loading, error actually come from. Looks like Apollo.
 */
const Organization = ({ organizationName }) => {
  return (
    <Query
      query={GET_REPOSITORIES_OF_ORGANIZATION}
      variables={{
        organizationName,
      }}
      skip={organizationName === ''}
      notifyOnNetworkStatusChange={true}
    >
      {({
        data,
        loading,
        error,
        fetchMore
      }) => {
        if (error) {
          return <ErrorMessage {...error} />;
        }

        const { organization } = data;

        if (loading && !organization) {
          return <Loading />;
        }

        return (
          <RepositoryList
            loading={loading}
            repositories={organization.repositories}
            fetchMore={fetchMore}
            entry={'organization'}
          />
        );
      }}
    </Query>
  );
};

export default Organization;
