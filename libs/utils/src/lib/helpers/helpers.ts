export const setToIfUndefined = (value: string, result: any) => (value === undefined || value.trim() === '' ? result : value);
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
