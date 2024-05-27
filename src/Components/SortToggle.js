// import React, { useState, useEffect } from 'react';
// import { ToggleButton } from '../Customer/CustomerStyle';

// const SortToggle = ({ items, setSortedItems, sortFunction, sortParams }) => {
//   const [isToggled, setIsToggled] = useState(true);

//   const toggleSortOrder = () => {
//     setIsToggled(!isToggled);
//   };

//   useEffect(() => {
//     const sortedItems = sortFunction(items, isToggled, ...sortParams);
//     setSortedItems(sortedItems);
//   }, [isToggled, items, sortFunction, sortParams, setSortedItems]);

//   return (
//     <ToggleButton onClick={toggleSortOrder}>
//       {isToggled ? "↑" : "↓"}
//     </ToggleButton>
//   );
// };

// export default SortToggle;

import React from 'react';
import { ToggleButton } from '../Customer/CustomerStyle';

const SortToggle = ({ isToggled, toggleSortOrder }) => {
  return (
    <ToggleButton onClick={toggleSortOrder}>
      {isToggled ? "↑" : "↓"}
    </ToggleButton>
  );
};

export default SortToggle;
