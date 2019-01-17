import React from 'react';

// This will be a generic item, but for now list of Issue reaction items.
const Item = ({ item }) => (
  <li>
    {item.content}
  </li>
);

export default Item;
