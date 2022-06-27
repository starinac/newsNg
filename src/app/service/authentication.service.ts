import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { API_URL } from '../app.const';
import {map} from 'rxjs/operators';

export const AUTHENTICATED_USER = 'authenticantedUser';
export const TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  executeJWTAuthentication(username: string, password: string) {
    return this.http.post<any>(`${API_URL}/auth/login`, {
      username,
      password
    }).pipe(
      map(
        data => {
          sessionStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, data.authenticationToken);
          return data;
        }
      )
    )
  }

  isUserLogedIn() {
    let user = sessionStorage.getItem('authenticantedUser');
    return !(user===null)
  }

  onLogout() {
    sessionStorage.removeItem('authenticantedUser');
  }
}
