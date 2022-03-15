import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryFn,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs';
import { IModel } from '../models/model.interface';
import { first, map, mergeMap } from 'rxjs/operators';
import { CollectionStats, StatsService } from './stats.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export enum CollectionType {
  Items = 'items',
  Authors = 'authors',
  Genres = 'genres',
  Locations = 'locations',
  Publishers = 'publishers',
}

export interface IDto {
  id?: string;
  uid?: string;
}

export abstract class BaseDtoService<T extends IModel, T_DTO extends IDto> {
  private readonly collectionType;
  private collection: (queryFn?: QueryFn) => AngularFirestoreCollection<T_DTO>;
  private dataSjt: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private statsSrv: StatsService;
  stats: Observable<CollectionStats | null>;
  private loadedSjt = new ReplaySubject<void>();
  private collectionData: T[] = [];

  protected constructor(
    protected afs: AngularFirestore,
    collectionType: CollectionType,
    private afAuth: AngularFireAuth
  ) {
    this.collectionType = collectionType;
    this.collection = (fn?) => afs.collection<T_DTO>(collectionType, fn);
    // @ts-ignore
    // this.uid = afs.firestore._credentials.currentUser.uid;

    this.statsSrv = new StatsService(afs, this.collectionType, afAuth);
    this.stats = this.statsSrv.get();
  }

  get uid(): Observable<string> {
    return this.afAuth.user.pipe(
      map((u) => {
        const uid = u?.uid ?? '';
        console.log(uid, u);

        if (!uid) {
          throw Error('Usuário não encontrado');
        }
        return uid;
      })
    );
  }

  get data(): Observable<T[]> {
    return this.dataSjt.asObservable();
  }

  get loaded(): Observable<void> {
    return this.loadedSjt.asObservable();
  }

  protected abstract toModel(dto: T_DTO): T;
  protected abstract toDto(obj: T): T_DTO;

  loadData(): Observable<void> {
    return this.uid.pipe(
      map((uid) => {
        this.collection((ref) => ref.where('uid', '==', uid))
          .stateChanges()
          .subscribe((actions: any) => {
            actions.map((a: any) => {
              const obj = this.toModel({
                id: a.payload.doc.id,
                ...a.payload.doc.data(),
              } as T_DTO);
              switch (a.type) {
                case 'added':
                  this.collectionData.splice(a.payload.newIndex, 0, obj);
                  break;
                case 'modified':
                  this.collectionData[a.payload.newIndex] = obj;
                  break;
                case 'removed':
                  this.collectionData.splice(a.payload.oldIndex, 1);
                  break;
              }
            });
            this.dataSjt.next(this.collectionData);
            this.loadedSjt.next();
            this.loadedSjt.complete();
          });
      })
    );
  }

  new(obj: T): Observable<T> {
    return this.uid.pipe(
      mergeMap((uid) => {
        obj.uid = uid;
        const dto = this.toDto(obj);
        delete dto.id;
        return from(
          this.collection()
            .add(dto)
            .then((ref) => ref.get())
            .then((ss) =>
              this.toModel({
                id: ss.id,
                ...ss.data(),
              } as T_DTO)
            )
        );
      })
    );
  }

  update(obj: T): Observable<T> {
    return this.uid.pipe(
      mergeMap((uid) => {
        obj.uid = uid;
        const dto = this.toDto(obj);
        delete dto.id;
        return from(
          this.collection()
            .doc(obj.id)
            .update(dto)
            .then(() => obj)
        );
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return from(
      this.collection()
        .doc(id)
        .delete()
        .then(() =>
          this.stats
            .pipe(first())
            .pipe(
              map((stats) => {
                stats?.count != null ? --stats.count : null;
                return stats;
              })
            )
            .toPromise()
        )
        .then((stats) =>
          this.statsSrv
            .set(this.collectionType, stats ?? ({} as CollectionStats))
            .toPromise()
            .catch((err) => console.error('Erro ao atualizar stats', err))
        )
        .then(() => true)
    );
  }

  save(obj: T): Observable<T> {
    return obj.id ? this.update(obj) : this.new(obj);
  }

  get(id: string): T {
    return this.collectionData.find((obj) => obj.id === id) ?? ({} as T);
  }
}
