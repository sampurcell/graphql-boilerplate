// This might not be neccessary
import React from 'react';

import List from './List';

const Repository = ({
  repository,
  onFetchMoreItems,
  onFavorite,
}) => (
  <div>
    <p>
      In Repository:&nbsp;
      <a href={repository.url}>{repository.name}</a>
    </p>
    <ul>
      {repository.issues.edges.map(issue => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a>
          <List list={issue.node.reactions} />
        </li>
      ))}

      <button
        type="button"
        onClick={() => onFavorite(repository.id, repository.viewerHasStarred)}
      >
        {repository.stargazers.totalCount}
        {repository.viewerHasStarred ? 'Unstar' : 'Star'}
      </button>
    </ul>

    <hr />

    {repository.issues.pageInfo.hasNextPage
      && (
        <button
          onClick={onFetchMoreItems}>
          Get more issues
       </button>
      )}
  </div>
);

export default Repository;
