import { HttpClient } from '@angular/common/http';
import { ApiAccess } from 'app/api-access';
import { IModel } from 'app/models/model.interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PaginatedData, Pagination } from './paginated-data';
import { PaginatedResponse } from './paginated-response.interface';

export interface IDto {
  uuid: string;
  ownerUuid: string;
}

export abstract class RestService<
  T extends IModel,
  T_DTO extends IDto,
  T_FETCH_DTO extends IDto
> {
  private $data = new BehaviorSubject<PaginatedData<T>>(new PaginatedData<T>());

  constructor(private http: HttpClient, readonly endpoint: string) {}

  private paginatedResponseToPaginatedData(
    res: PaginatedResponse<T_FETCH_DTO>
  ): PaginatedData<T> {
    const paginatedData = new PaginatedData<T>();
    paginatedData.data = res.data?.map((dto) => this.toModel(dto));
    paginatedData.total = res.total;
    if (res.limit) {
      paginatedData.pageSize = res.limit;
    }
    if (res.offset) {
      paginatedData.page = (res.offset ?? 0) / paginatedData.pageSize;
    }
    return paginatedData;
  }

  private getFecthParams(pagination: Pagination, search?: any, sort?: string) {
    let params: any = {
      limit: pagination.pageSize,
      offset: pagination.pageSize * pagination.page,
    };
    if (search && Object.keys(search).length) {
      params['search'] = JSON.stringify(search);
    }
    if (sort) {
      params['sort'] = sort;
    }
    return params;
  }

  abstract toModel(dto: T_FETCH_DTO): T;
  abstract toDto(obj: T): T_DTO;

  get data(): Observable<PaginatedData<T>> {
    return this.$data.asObservable();
  }

  get(uuid: string): Observable<T> {
    const url = ApiAccess.getUrl(this.endpoint).get(uuid);
    const headers = ApiAccess.getAuthHeaders();
    return this.http.get<T>(url, { headers });
  }

  fetch(
    pagination = new Pagination(),
    search?: any,
    sort?: string
  ): Observable<T[]> {
    const url = ApiAccess.getUrl(this.endpoint).fetch();
    const headers = ApiAccess.getAuthHeaders();
    const params = this.getFecthParams(pagination, search, sort);
    return this.http
      .get<PaginatedResponse<T_FETCH_DTO>>(url, { headers, params })
      .pipe(
        map((res) => {
          const pagData = this.paginatedResponseToPaginatedData(res);
          console.log('aaa');
          this.$data.next(pagData);
          return pagData.data;
        })
      );
  }

  create(obj: T): Observable<T> {
    console.log('criando');
    const url = ApiAccess.getUrl(this.endpoint).create();
    const dto = this.toDto(obj);
    console.log(dto);
    const headers = ApiAccess.getAuthHeaders();
    return this.http
      .post<T_FETCH_DTO>(url, dto, { headers })
      .pipe(map((dto) => this.toModel(dto)));
  }

  update(obj: T): Observable<T> {
    const url = ApiAccess.getUrl(this.endpoint).update(obj.uuid!);
    const dto = this.toDto(obj);
    console.log(dto);
    const headers = ApiAccess.getAuthHeaders();
    return this.http
      .put<T_FETCH_DTO>(url, dto, { headers })
      .pipe(map((dto) => this.toModel(dto)));
  }

  save(obj: T): Observable<T> {
    return !obj?.uuid ? this.create(obj) : this.update(obj);
  }

  remove(obj: T): Observable<void> {
    const url = ApiAccess.getUrl(this.endpoint).remove(obj.uuid!);
    const headers = ApiAccess.getAuthHeaders();
    return this.http.delete(url, { headers }).pipe(map(() => undefined));
  }
}
