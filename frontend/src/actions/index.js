export const Actions = {
  SELECT_ITEM: 0,
  LOAD_STATISTICS: 1,
};

export const selectItem = (item) => {
  console.log('Selected item: ', item);
  return {
    type: Actions.SELECT_ITEM,
    payload: item
  };
};

export const loadStatistics = (data) => {
  console.log('Load statistics: ', data);
  return {
    type: Actions.LOAD_STATISTICS,
    payload: data
  };
};
