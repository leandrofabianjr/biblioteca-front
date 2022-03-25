import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'app/models/user';

const UserData = {
  exists: () => localStorage.getItem('user') != null,
  get: () => JSON.parse(localStorage.getItem('user') ?? ''),
  set: (data: any) => localStorage.setItem('user', JSON.stringify(data)),
  remove: () => localStorage.removeItem('user'),
};

export interface IAppUserDTO {
  uid: string;
  email: string;
  name: string;
  photoUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}

  static get token(): string {
    return UserData.get()?.token?.access_token;
  }

  static get currentUser(): User {
    return UserData.get()?.user;
  }

  static get isUserLogged(): boolean {
    return UserData.exists();
  }

  loginWithJwt(jwt: any): Observable<void> {
    const url = 'http://localhost:3000/auth/userdata';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwt}`,
    });
    return this.http.get(url, { headers }).pipe(
      map((data) => {
        console.log(data);
        UserData.set(data);
      })
    );
  }

  logout() {
    UserData.remove();
    this.router.navigate(['/login']);
  }
}
