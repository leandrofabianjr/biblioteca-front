import { HttpHeaders } from '@angular/common/http';
import { Apollo, TypedDocumentNode } from 'apollo-angular';
import { map, Observable } from 'rxjs';

export const HASURA_ADMIN_SECRET = '';

export const HASURA_CONTEXT = {
  headers: new HttpHeaders({
    'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
  }),
};

export interface FetchForTableResponse<T> {
  data: T[];
  total: number;
}

export abstract class GrapgQLRepository<T, T_DTO> {
  abstract repositoryName: string;
  abstract fetchForTableQuery: any;

  constructor(private apollo: Apollo) {}

  abstract toModel(dto: T_DTO): T;

  fetchForTable(variables = {}): Observable<FetchForTableResponse<T>> {
    return this.apollo
      .query({
        query: this.fetchForTableQuery,
        variables,
        context: HASURA_CONTEXT,
      })
      .pipe(
        map((result: any) => {
          console.log(result);
          return {
            data: result.data[this.repositoryName].map((_dto: T_DTO) =>
              this.toModel(_dto)
            ),
            total:
              result.data[this.repositoryName + '_aggregate']?.aggregate
                ?.totalCount,
          } as FetchForTableResponse<T>;
        })
      );
  }
}
