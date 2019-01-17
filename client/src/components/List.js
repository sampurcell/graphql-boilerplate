import React from 'react';

import Item from './Item';

// This will be a generic list, but for now list of Issue reactions.
const List = ({ list }) => (
  <ul>
    {list.edges.map(item => (
      <Item key={item.node.id} item={item.node} />
    ))}
  </ul>
);

export default List;
