export const PAGE_SIZE_OPTIONS = [5, 10, 100];

export class Pagination {
  constructor(public page = 0, public pageSize = PAGE_SIZE_OPTIONS[0]) {}
}

export class PaginatedData<T> extends Pagination {
  total: number = 0;
  data: T[] = [];
}
