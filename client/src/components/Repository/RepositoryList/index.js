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
 * Function to let Apollo know how to combine the queries.
 * Has access to previously fetched data and newly fetched data fragment.
 *
 * Return an object that combines the two with spread operators,
 * adhering to query structure.
 *
 * IMPT part is merging the edges of the newly updated object.
 * @todo - Update these functions that combine nested objects using Lenses from Ramda.js
 * (example in GraphQL book in Apollo/React section).
 */
const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};


/**
 * Use React's Fragment and the fetchMore function returned from mutation results.
 *
 * 1. Render each repository.
 * 2. If hasNextPage is true, Render the 'More Repositories' textButton,
 * and pass a function that runs fetchMore when button is clicked.
 * You pass fetchMore an object with a cursor and a function to combine new results,
 * with results already on the page.
 * 3. Lastly add the cursor property to the params object for fetchMore().
 */
const RepositoryList = ({ repositories, loading, fetchMore }) => (
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
        updateQuery={updateQuery}
        fetchMore={fetchMore}
      >
        Repository
      </FetchMore>
    </div>
  </Fragment>
);

export default RepositoryList;
