import { Observable, of } from 'rxjs';
import { OldIModel } from '../models/model.interface';

export enum CollectionType {
  Items = 'items',
  Authors = 'authors',
  Genres = 'genres',
  Locations = 'locations',
  Publishers = 'publishers',
}
export interface aaIDto {
  id?: string;
  uid?: string;
}

export abstract class BaseDtoService<
  T extends OldIModel,
  T_DTO extends aaIDto
> {
  constructor(protected afs: any, collectionType: any, private afAuth: any) {}
  get data(): Observable<T[]> {
    return of([]);
  }

  protected abstract toModel(dto: T_DTO): T;
  protected abstract toDto(obj: T): T_DTO;

  loadData(): Observable<void> {
    return of();
  }

  new(obj: T): Observable<T> {
    return of({} as T);
  }

  update(obj: T): Observable<T> {
    return of({} as T);
  }

  delete(id: string): Observable<boolean> {
    return of(true);
  }

  save(obj: T): Observable<T> {
    return obj.id ? this.update(obj) : this.new(obj);
  }

  get(id: string): T {
    return {} as T;
  }
}
