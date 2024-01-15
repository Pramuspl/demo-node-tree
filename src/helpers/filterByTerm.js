export const filterByTerm = (element, search) =>
  element.toLocaleLowerCase().includes(search.toLocaleLowerCase());
