import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAccess } from 'app/api-access';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserStats {
  items: number;
  authors: number;
  genres: number;
  publishers: number;
  locations: number;
}

@Injectable({ providedIn: 'root' })
export class MeService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<UserStats> {
    const url = ApiAccess.getUrl().stats();
    const headers = ApiAccess.getAuthHeaders();
    return this.http.get<UserStats>(url, { headers });
  }

  getPhotoUrl(): Observable<string> {
    const url = ApiAccess.getUrl().userPhoto(AuthService.currentUser.uuid);
    return this.http.get<string>(url);
  }
}
