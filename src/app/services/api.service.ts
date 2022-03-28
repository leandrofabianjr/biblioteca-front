import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IModel } from 'app/models/model.interface';
import { environment } from 'environments/environment';

import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PaginatedData, Pagination } from './paginated-data';
import { PaginatedResponse } from './paginated-response.interface';

const API_URL_BASE = environment.apiUrlBase;

export interface IDto {
  uuid: string;
  ownerId: string;
}

export abstract class ApiService<T extends IModel, T_DTO extends IDto> {
  readonly url = {
    get: (uuid: string) => `${API_URL_BASE}/${this.endpoint}/${uuid}`,
    fetch: () => `${API_URL_BASE}/${this.endpoint}`,
    create: () => `${API_URL_BASE}/${this.endpoint}`,
    update: (uuid: string) => `${API_URL_BASE}/${this.endpoint}/${uuid}`,
    authUserData: () => `auth/userdata`,
  };

  private $data = new BehaviorSubject<PaginatedData<T>>(new PaginatedData<T>());

  constructor(private http: HttpClient, readonly endpoint: string) {}

  private get authHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${AuthService.token}`,
    });
  }

  private paginatedResponseToPaginatedData(
    res: PaginatedResponse<T>
  ): PaginatedData<T> {
    const paginatedData = new PaginatedData<T>();
    paginatedData.data = res.data;
    paginatedData.total = res.total;
    if (res.limit) {
      paginatedData.pageSize = res.limit;
    }
    if (res.offset) {
      paginatedData.page = (res.offset ?? 0) / paginatedData.pageSize;
    }
    return paginatedData;
  }

  private paginationToParams(pagination: Pagination) {
    return {
      limit: pagination.pageSize,
      offset: pagination.pageSize * pagination.page,
    };
  }

  protected abstract toModel(dto: T_DTO): T;
  protected abstract toDto(obj: T): T_DTO;

  get data(): Observable<PaginatedData<T>> {
    return this.$data.asObservable();
  }

  getLoginUserData() {
    const url = this.url.authUserData();
    const headers = this.authHeaders;
    return this.http.get<T>(url, { headers });
  }

  get(uuid: string): Observable<T> {
    const url = this.url.get(uuid);
    const headers = this.authHeaders;
    return this.http.get<T>(url, { headers });
  }

  fetch(pagination = new Pagination()): Observable<void> {
    const url = this.url.fetch();
    const headers = this.authHeaders;
    const params = this.paginationToParams(pagination);
    return this.http.get<PaginatedResponse<T>>(url, { headers, params }).pipe(
      map((res) => {
        console.log(res);
        this.$data.next(this.paginatedResponseToPaginatedData(res));
      })
    );
  }

  create(obj: T): Observable<T> {
    console.log('criando');
    const url = this.url.create();
    const dto = this.toDto(obj);
    console.log(dto);
    const headers = this.authHeaders;
    return this.http.post<T_DTO>(url, dto, { headers }).pipe(
      map((dto) => {
        console.log(dto);
        return this.toModel(dto);
      })
    );
  }

  save(obj: T): Observable<T> {
    if (!obj?.uuid) return this.create(obj);

    const url = this.url.update(obj.uuid);
    const dto = this.toDto(obj);
    console.log(dto);
    const headers = this.authHeaders;
    return this.http.put<T_DTO>(url, dto, { headers }).pipe(
      map((dto) => {
        console.log(dto);
        return this.toModel(dto);
      })
    );
  }
}
