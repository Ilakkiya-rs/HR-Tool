export function addTosessionStorage(item) {
  console.log('item', item);
  // Get the existing list from local storage
  const existingList = JSON.parse(sessionStorage.getItem('items') || '[]');

  // Check if the item already exists in the list
  const isDuplicate = existingList.some(
    (existingItem) =>
      existingItem.path_addr === item.path_addr &&
      existingItem.path_addr === item.path_addr
  );

  // If the item is not a duplicate, add it to the list
  if (!isDuplicate) {
    const newList = [...existingList, item];
    sessionStorage.setItem('items', JSON.stringify(newList));
  }
}
export function getListFromsessionStorage() {
  if (sessionStorage.getItem('items')) {
    return JSON.parse(sessionStorage.getItem('items'));
  }
  return [];
}
export function clearsessionStorage() {
  sessionStorage.removeItem('items');
}

export const saveListToSessionStorage = (list) => {
  sessionStorage.setItem('items', JSON.stringify(list));
};

export const removeItemsFromSessionStorageAfterIndex = (index) => {
  const list = getListFromsessionStorage();
  const newList = list.slice(0, index + 1); // Keep the elements up to and including the specified index
  saveListToSessionStorage(newList);
};
