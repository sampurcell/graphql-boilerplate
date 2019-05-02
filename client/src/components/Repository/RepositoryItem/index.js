import React from 'react';

/**
 * Import things from graphQL, Apollo and React.
 */
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

/**
 * Import some material-ui style stuff
 */
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grade, GradeOutlined } from '@material-ui/icons';

/**
 * Import application components.
 */
import Link from '../../Link';
import RepositoryDescription from '../RepositoryDescription';
import { TextButton } from '../../Button';

/**
 * Import GraphQL fragments.
 */
import REPOSITORY_FRAGMENT from '../fragment';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';


/**
 * Helper function that can be used to extract id from mutation result and update the cache.
 *
 * A few things are going on here:
 *
 * 1. The parameters destructure the returned data so you have access to 'id' property.
 * 2. Uses ApolloClient's readFragment() method to get the repository from cache.
 * passes it the id and fragment of the repository you are targeting.
 * 3. Using the repository fragment, Apollo updates the count.
 * 5. It then writes the updated repository info back to the cache.
 */
const updateAddStar = (
  client,
  { data: { addStar: { starrable: { id } } } }
) => {
  /**
   * Step 1. Read the fragment in the cache,
   * passing the id and fragment to the ApolloClient.
   */
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  /**
   * Step 2. Add 1 to the totalCount that's already in the cache.
   */
  const totalCount = repository.stargazers.totalCount + 1;

  /**
   * Step 3. Use ApolloClient and object destructuring
   * to write an updated fragment to the ApolloClient cache.
   */
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      }
    }
  });
};

/**
 * Example of a GraphQL mutation.
 * Ths one is for adding a star to a repo.
 *
 * You pass it an object with the starrableId key,
 * and you get the mutation results back if the mutation is successful.
 */
const STAR_REPO = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

/**
 * This is the same process as addStar, just in reverse.
 */
const updateRemoveStar = (
  client,
  { data: { removeStar: { starrable: { id } } } }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      }
    }
  });
};

/**
 * This is another mutation this one for unstarring a repo.
 * As you can see almost identical to mutation above.
 */
const UNSTAR_REPO = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

/**
 * Let user "water" the repository they are looking at.
 */
const WATCH_REPOSITORY = gql`
  mutation(
    $id: ID!,
    $viewerSubscription: SubscriptionState!
  ) {
    updateSubscription(
      input: {
        state: $viewerSubscription,
        subscribableId: $id,
      }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

/**
 * Create an object to hold information about the subscription.
 */
const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

/**
 * Create some helper methods for dealing with subscriptions
 */
const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

/**
 * Handles an update to ApolloClient cache that doesn't come from query.
 * Pass in the expected data from the mutation result.
 */
const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: {
          id,
          viewerSubscription
        },
      },
    },
  },
) => {
  /**
   * Read the fragment from the cache.
   */
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  /**
   * Get the total count of watchers.
   */
  let { totalCount } = repository.watchers;

  /**
   * Decide whether to increment or decrement based on the state of the repository
   */
  totalCount = (viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED) ?
    totalCount + 1 :
    totalCount - 1;

  /**
   * Write the updated fragment back to the cache
   * The watchers' totalCount will be updated.
   */
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};

/**
 * Create styles to inject
 * @param {object} theme - UI theme
 */
const styles = () => ({
  root: {
		padding: 24,
    textAlign: 'center',
    color: '#333',
  },
});

/**
 * These mutations are toggled and the UI is re-rendered again.
 * Uses renderProps() pattern to get mutation result
 * re: addStar, data, loading, error
 *
 * There is also an update prop in the Mutation component.
 * This allows you to update an item in cache manually as the mutation or query is made.
 *
 * Optimistic UI:
 *
 * Includes an optimistic UI prop for mutations.
 *
 * It defines:
 *
 * 1. the type of request (mutation),
 * 2. the type of fragment (repository),
 * 3. the mutation response fields (id, viewerSubscribed), and
 * 4. the expected value (true or false)
 */
const RepositoryItem = ({
	classes,
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => {
  return (
		<Paper className={classes.paper}>
    <div className="repo-item">
      <h2>
        <Link href={url} text={name || "View Link"} />
      </h2>

      <div className="repo-item__watchers">
        <Mutation
          mutation={WATCH_REPOSITORY}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription) ?
              VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED :
              VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
          }}
          optimisticResponse={{
            updateSubscription: {
              __typename: 'Mutation',
              subscribable: {
                __typename: 'Repository',
                id,
                viewerSubscription: isWatch(viewerSubscription) ?
                  VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED :
                  VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
              }
            }
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, loading, error }) => (
            <TextButton
              className="button--secondary"
              onClick={updateSubscription}
            >
              {watchers.totalCount}{' '}
              {isWatch(viewerSubscription) ? 'Watch' : 'Unwatch'}
            </TextButton>
          )}
        </Mutation>
      </div>

      <div className="repo-item__favorites">
        {viewerHasStarred ? (
          <Mutation
            mutation={UNSTAR_REPO}
            variables={{ id }}
            update={updateRemoveStar}
          >
            {(removeStar, { data, loading, error }) => (
              <TextButton
                className="button button--secondary"
                onClick={removeStar}
              >
                <Grade />
                Unstar {stargazers.totalCount}
              </TextButton>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={STAR_REPO}
            variables={{ id }}
            update={updateAddStar}>
            {(addStar, { data, loading, error }) => (
              <TextButton
                className="button button--secondary"
                onClick={addStar}
              >
								<GradeOutlined />
                Star {stargazers.totalCount}
              </TextButton>
            )}
          </Mutation>
        )}
      </div>

      <div className="repo-item__details">
        {descriptionHTML &&
          <RepositoryDescription {...descriptionHTML} />
        }
        <div className="repo-item__details__info">
          <div>
            {primaryLanguage && (
              <span>Language: {primaryLanguage.name}</span>
            )}
          </div>
          <div>
            {owner && (
              <span>
                Owner: <a href={owner.url}>{owner.login}</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
		</Paper>
  );
};

export default withStyles(styles)(RepositoryItem);
