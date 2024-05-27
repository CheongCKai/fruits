export const sortByDate = (orders, isLatestFirst) => {
    return [...orders].sort((a, b) => {
      const dateA = a.purchasedate.toDate();
      const dateB = b.purchasedate.toDate();
      return isLatestFirst ? dateB - dateA : dateA - dateB;
    });
  };
  
export const sortByCompletion = (orders, isCompletedFirst) => {
    return [...orders].sort((a, b) => {
      if (a.status === b.status) return 0;
      return isCompletedFirst ? (a.status === 'Completed' ? -1 : 1) : (a.status === 'Completed' ? 1 : -1);
    });
  };