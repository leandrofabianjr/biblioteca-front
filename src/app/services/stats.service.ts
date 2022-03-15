import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, mergeMap, Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { CollectionType } from './base-dto.service';

export interface CollectionStats {
  count: number;
}

export class StatsService {
  private statsSjt?: BehaviorSubject<CollectionStats>;
  private path = (collectionName: string, uid: string) =>
    `/users/${uid}/stats/${collectionName}`;

  constructor(
    private afs: AngularFirestore,
    collectionType: CollectionType,
    private afAuth: AngularFireAuth
  ) {
    // @ts-ignore
    // this.uid = afs.firestore._credentials.currentUser.uid;
    this.afAuth.user.subscribe((u) =>
      this.afs
        .doc(this.path(collectionType, u?.uid ?? ''))
        .valueChanges()
        .subscribe((stats) => this.statsSjt?.next(stats as CollectionStats))
    );
  }

  get(): Observable<CollectionStats | null> {
    return this.statsSjt?.asObservable() ?? new BehaviorSubject(null);
  }

  set(collectionName: string, stats: CollectionStats): Observable<boolean> {
    return this.afAuth.user.pipe(
      mergeMap((u) =>
        this.afs
          .doc(this.path(collectionName, u?.uid ?? ''))
          .update(stats)
          .then(() => true)
      )
    );
  }
}
