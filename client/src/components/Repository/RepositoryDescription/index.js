import React from 'react';

/**
 * This was pulled out of the RepositoryItem component,
 * because it receives some HTML as a prop.
 *
 * It was being set with dangerouslySetInnerHTML, which was not allowed
 * once context was allowed.
 */
const RepositoryDescription = ({ descriptionHTML }) => {
  if (descriptionHTML) {
    return (
      <div className="repo-item__description">
        {descriptionHTML}
      </div>
    );
  } else {
    return false;
  }
};

export default RepositoryDescription;
