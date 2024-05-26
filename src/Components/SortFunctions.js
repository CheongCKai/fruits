export const sortByDate = (orders, isLatestFirst) => {
    return [...orders].sort((a, b) => {
      const dateA = a.purchasedate.toDate();
      const dateB = b.purchasedate.toDate();
      return isLatestFirst ? dateB - dateA : dateA - dateB;
    });
  };
  
export const sortByCompletion = (tasks, isCompletedFirst) => {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return isCompletedFirst ? (a.completed ? -1 : 1) : (a.completed ? 1 : -1);
    });
  };