export function withQuery(path: string, query?: Record<string, string | number | boolean | undefined>) {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}
