// Even though it's a stateless, functional component, you still need react for the JSX
import React from 'react';

import Repository from '../Repository/Repository';

const Organization = ({ organization, errors, onFetchMoreItems, onFavorite }) => {
  if (errors) {
    return (
      <p>
        Something went wrong:
        {errors.map(error => error.message.join(' '))}
      </p>
    );
  }

  return (
    <div>
      <p>
        Issues from Organization:&nbsp;
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository
        repository={organization.repository}
        onFetchMoreItems={onFetchMoreItems}
        onFavorite={onFavorite}
      />
    </div>
  );
};

export default Organization;
