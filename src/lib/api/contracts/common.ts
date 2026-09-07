export type ApiScope = "student" | "admin";

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PageResult<T> = {
  items: T[];
  meta: PageMeta;
};

export type ApiProblem = {
  status: number;
  code: string;
  title: string;
  detail?: string;
  fields?: Record<string, string[]>;
  requestId?: string;
};

export type ListFilter = {
  page?: number;
  pageSize?: number;
  search?: string;
};
