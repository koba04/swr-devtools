export const formatDateTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

// TODO: this is a draft implementation
export const toJSON = (value: any) => {
  return value instanceof Error ? { message: value.message } : value;
};
