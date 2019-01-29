/**
 * The fragment import is a way to indicate where the new results,
 * from pagination should be inserted.
 */
import React, { Fragment } from 'react';

/**
 * Import the helper components.
 */
import Loading from '../../Loading';

/**
 * Import application components needed for this component.
 */
import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';

/**
 * Curried function is a helper for repository.
 *
 * Updates to previous updateQuery function, which lets Apollo know how to combine the queries.
 * Has access to previously fetched data and newly fetched data fragment.
 *
 * Return an object that combines the two with spread operators,
 * adhering to query structure.
 *
 * IMPT part is merging the edges of the newly updated object.
 * @todo - Update these functions that combine nested objects using Lenses from Ramda.js
 * (example in GraphQL book in Apollo/React section).
 *
 * The new part, is the entry is provided by our component that's rendering it (Profile or Organization).
 *
 * This then returns a function that takes the props that Apollo provides to the updateQuery prop,
 * previousResult and { fetchMoreResult },
 * and that will be called when an AJAX call returns with data (or no data).
 */
const getUpdateQuery = entry => (
  previousResult,
  { fetchMoreResult },
) => {
  /**
   * Send the previousResult back if there are no more results.
   */
  if (!fetchMoreResult) {
    return previousResult;
  }

  /**
   * Now we use entry and a key on the return.
   */
  return {
    ...previousResult,
    [entry]: {
      ...previousResult[entry],
      repositories: {
        ...previousResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges,
        ]
      },
    },
  };
};


/**
 * Use React's Fragment and the fetchMore function returned from mutation results.
 *
 * Fragment is for pagination. @todo - Find out exactly what it does.
 * It seems as though it takes the whole section of code that has to do with the update,
 * including the More button that fires the request.
 *
 * 1. Render each repository.
 * 2. If hasNextPage is true, Render the 'More Repositories' textButton,
 * and pass a function that runs fetchMore when button is clicked.
 * You pass fetchMore an object with a cursor and a function to combine new results,
 * with results already on the page.
 * 3. Add the cursor property to the params object for fetchMore().
 * 4. Lastly, wrap the updateQuery prop value with a function that will decide what update query is needed.
 */
const RepositoryList = ({
  repositories,
  loading,
  fetchMore,
  entry,
}) => (
  <Fragment>
    <div className="repos-container">
      {repositories.edges.map(({ node }) => (
        <div
          key={node.id}
          className="repo-item-container"
        >
          <RepositoryItem {...node} />
        </div>
      ))}
      <FetchMore
        loading={loading}
        hasNextPage={repositories.pageInfo.hasNextPage}
        variables={{
          cursor: repositories.pageInfo.endCursor,
        }}
        updateQuery={getUpdateQuery(entry)}
        fetchMore={fetchMore}
      >
        Repository
      </FetchMore>
    </div>
  </Fragment>
);

export default RepositoryList;
