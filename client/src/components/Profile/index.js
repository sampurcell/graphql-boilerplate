import React from 'react';

/**
 * Use this package to define your query.
 */
import gql from 'graphql-tag';

/**
 * Import query from react apollo for writing GraphQL queries in React.
 */
import { Query } from 'react-apollo';

/**
 * Import helper components.
 */
import Loading from '../Loading';
import Error from '../Error';

/**
 * Import your application components and your fragments.
 */
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';

/**
 * Define your GraphQL query for this view.
 * There is a fragmenet used here. You add it with a template lteral,
 * then you use the fragment with the spread operator.
 *
 * Add a query function that takes a cursor variable,
 * that will be your new after prop for the repositories function in the qyer.
 */
const GET_USER_PROFILE = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5,
        orderBy: { direction: DESC, field: CREATED_AT },
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
 * Then insert it in the Query object from react-apollo
 * The JSX below will have access to the results.
 * This is based on the render props pattern of React.
 * API exposes a 'fetchMore' function in the response that can be used
 * in the button to fetchMore() repositories.
 *
 * NOTE: The notifyOnNetworkStatusChange prop tells Profile to update when the network status changes.
 * This is impt because it means there is another query being made to ApolloClient.
 * It lets us asynchronously request more items and also trigger an update to the UI when there is a response.
 *
 * What to render?:
 *
 * If there's an error from renderProps, return the error message.
 * Get the viewer from the data response.
 * If its loading AND there's no viewer in data, return loading component.
 * Otherwise, continue on (not loading anymore, or loading but no viewer)
 * @todo - Refactor the query and the one in App so it can be accessible in the header and here.
 */
const Profile = () => (
  <Query query={GET_USER_PROFILE}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { viewer } = data;

      if (loading && !viewer) {
        return <Loading />;
      }

      /**
       * If its loading but there is a viewer,
       * it means its an AJAX call, and the new query is still out.
       */
      return (
        <div className="profile-container">
          <div className="profile__body">
            <div className="profile__repos-">
              <RepositoryList
                loading={loading}
                repositories={viewer.repositories}
                fetchMore={fetchMore}
              />
            </div>
          </div>
        </div>
      );
    }}
  </Query>
);

export default Profile;
