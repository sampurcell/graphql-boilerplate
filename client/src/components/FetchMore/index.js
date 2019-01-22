import React from 'react';

/**
 * Import application components.
 */
import { TextButton } from '../Button';

const FetchMore = ({
  variables,
  updateQuery,
  fetchMore,
  children,
}) => (
  <div className="fetch-more-container">
    <TextButton
      type="button"
      className="button--secondary"
      onClick={() => fetchMore({
        variables,
        updateQuery,
      })}
    >
      More {children}
    </TextButton>
  </div>
);

export default FetchMore;


