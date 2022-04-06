import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from './services/auth.service';

export class ApiAccess {
  static readonly URL_BASE = environment.apiUrlBase;

  static getUrl = (endpoint?: string) => ({
    googleLogin: () => `${this.URL_BASE}/auth/google`,
    authUserData: () => `${this.URL_BASE}/auth/userdata`,
    get: (uuid: string) => `${this.URL_BASE}/${endpoint}/${uuid}`,
    fetch: () => `${this.URL_BASE}/${endpoint}`,
    create: () => `${this.URL_BASE}/${endpoint}`,
    update: (uuid: string) => `${this.URL_BASE}/${endpoint}/${uuid}`,
    remove: (uuid: string) => `${this.URL_BASE}/${endpoint}/${uuid}`,
  });

  static getAuthHeaders(token?: string) {
    return new HttpHeaders({
      Authorization: `Bearer ${token ?? AuthService.token}`,
    });
  }
}
