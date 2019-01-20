/**
 * The fragment import is a way to indicate where the new results,
 * from pagination should be inserted.
 */
import React, { Fragment } from 'react';

/**
 * Import application components needed for this component.
 */
import RepositoryItem from '../RepositoryItem';
import { TextButton } from '../../Button';


/**
 * Use React's Fragment and the fetchMore function returned from mutation results.
 * 1. Render each repository.
 * 2. If hasNextPage is true, Render the 'More Repositories' textButton,
 * and pass a function that runs fetchMore when button is clicked.
 */
const RepositoryList = ({ repositories, fetchMore }) => (
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

      {repositories.pageInfo.hasNextPage && (
        <TextButton
          type="button"
          onClick={() => fetchMore({
            // Configuration object
          })}
        >
          More Repositories
        </TextButton>
      )}
    </div>
  </Fragment>
);

export default RepositoryList;
