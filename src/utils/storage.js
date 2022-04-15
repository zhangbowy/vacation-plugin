export const getItem = (...args) => localStorage.getItem(...args);

export const setItem = (...args) => localStorage.setItem(...args);

export const removeItem = (...args) => localStorage.removeItem(...args);

export default {
  getItem,
  setItem,
  removeItem
};
