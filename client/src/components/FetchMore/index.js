import React from 'react';

/**
 * Import application components.
 */
import Loading from '../Loading';
import { UnobtrusiveButton } from '../Button';

const FetchMore = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children,
}) => (
  <div className="fetch-more-container">
    {loading ? (
      <Loading />
    ) : (
      hasNextPage && (
        <UnobtrusiveButton
          type="button"
          className="button--secondary"
          onClick={() => fetchMore({
            variables,
            updateQuery,
          })}
        >
          More {children}
        </UnobtrusiveButton>
      )
    )}
  </div>
);

export default FetchMore;


