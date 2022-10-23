const INITIAL_PAGE_SIZE = 20;

export class PaginationParams {
  page = 1;
  pageSize = INITIAL_PAGE_SIZE;
}

export class QueryParams extends PaginationParams {
  ordering: string;
  search: string;

  [key: string]: string | number | boolean;
}
