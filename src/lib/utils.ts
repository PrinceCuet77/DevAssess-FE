export { cn } from "cn"

// The API rejects empty strings (e.g. `search=`), so drop empty params up front.
export const compact = (query: object) =>
  Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ''));
