export const getIndex = (stateSegment, itemId) => {
  return stateSegment.findIndex((prod) => prod.id === itemId);
};

export const updateCollection = (stateSegment, itemId, itemToUpdateWith) => {
  const itemIndex = getIndex(stateSegment, itemId); //get the index of the passed item
  const updatedCollection = [...stateSegment]; //copy current state
  updatedCollection[itemIndex] = itemToUpdateWith; //find the position of the passed item index, and replace it with the passed item
  return updatedCollection;
};
