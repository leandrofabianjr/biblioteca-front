import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { forkJoin, from, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GoogleAuthProvider } from 'firebase/auth';
import { Apollo, gql } from 'apollo-angular';
import { HASURA_ADMIN_SECRET, HASURA_CONTEXT } from './graphql-repository';
import { HttpHeaders } from '@angular/common/http';
import { AppUser } from '../models/user.';
import { v4 as uuidv4 } from 'uuid';

const FIND_USER_BY_EMAIL_QUERY = gql`
  query ($email: String!) {
    users(where: { email: { _eq: $email } }) {
      created_at
      email
      google_uid
      name
      profile_picture_url
      updated_at
      uuid
    }
  }
`;

const UPSERT_USER_MUTATION = gql`
  mutation ($newUser: users_insert_input!) {
    insert_users(
      objects: [$newUser]
      on_conflict: {
        constraint: users_email_key
        update_columns: [google_uid, profile_picture_url, name]
      }
    ) {
      returning {
        email
        created_at
        google_uid
        name
        profile_picture_url
        uuid
        updated_at
      }
    }
  }
`;

export interface IUserDTO {
  uuid: string;
  email?: string;
  google_uid?: string;
  name?: string;
  profile_picture_url?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    private apollo: Apollo,
    private router: Router
  ) {}

  private _currentUser?: AppUser;

  get currentUser(): Observable<AppUser | undefined> {
    if (this._currentUser) this.currentUser;

    return this.afAuth.authState.pipe(
      switchMap((user) => this.getUserByEmail(user?.email)),
      map((user) => (this._currentUser = user))
    );
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

  googleLogin(): Observable<AppUser | undefined> {
    return from(this.afAuth.signInWithPopup(new GoogleAuthProvider())).pipe(
      switchMap((credential) => this.updateUserData(credential.user)),
      map((user) => {
        this._currentUser = user;
        console.log(user);
        return user;
      })
    );
  }

  private getUserByEmail(
    email?: string | null
  ): Observable<AppUser | undefined> {
    return this.apollo
      .query({
        query: FIND_USER_BY_EMAIL_QUERY,
        variables: { email },
        context: HASURA_CONTEXT,
      })
      .pipe(
        map((result: any) => {
          console.log('++++++++++');
          console.log(result);
          console.log('++++++++++');
          const dto = result.data?.users?.[0];
          if (!dto) return;
          return this.toModel(dto);
        })
      );
  }

  toModel(dto: IUserDTO): AppUser {
    let user = new AppUser();
    user.uuid = dto.uuid;
    user.email = dto.email;
    user.google_uid = dto.google_uid;
    user.name = dto.name;
    user.profile_picture_url = dto.profile_picture_url;
    user.created_at = dto.created_at;
    user.updated_at = dto.updated_at;
    return user;
  }

  private updateUserData(user: any): Observable<AppUser | undefined> {
    const newUser: IUserDTO = {
      uuid: uuidv4(),
      email: user.email,
      google_uid: user.uid,
      name: user.displayName,
      profile_picture_url: user.photoURL,
    };
    console.log(newUser);

    return this.apollo
      .mutate({
        mutation: UPSERT_USER_MUTATION,
        variables: { newUser },
        context: HASURA_CONTEXT,
      })
      .pipe(
        map((result: any) => {
          const dto = result?.data?.insert_users?.returning?.[0];
          if (!dto) return;
          return this.toModel(dto);
        })
      );
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this._currentUser = undefined;
      this.router.navigate(['/login']);
    });
  }
}
