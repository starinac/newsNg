import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { API_URL } from '../app.const';
import {map} from 'rxjs/operators';

export const AUTHENTICATED_USER = 'authenticatedUser';
export const TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string) {
    if(username === 'nikola' && password === 'nikola') {
      sessionStorage.setItem('authenticatedUser', username);
      return true;
    }
    return false;
  }

  executeJWTAuthentication(username: string, password: string) {
    return this.http.post<any>(`${API_URL}/authenticate`, {
      username,
      password
    }).pipe(
      map(
        data => {
          sessionStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          return data;
        }
      )
    )
  }

  isUserLogedIn() {
    let user = sessionStorage.getItem('authenticatedUser');
    return !(user===null)
  }

  onLogout() {
    sessionStorage.removeItem('authenticatedUser');
    
  }
}
