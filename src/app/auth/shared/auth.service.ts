import { Injectable } from '@angular/core';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }
  
  constructor(private httpClient: HttpClient) { }
  
  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post('http://localhost:8080/auth/signup', signupRequestPayload, { responseType: 'text' });
  }
  
  getJwtToken() {
    return sessionStorage.getItem('token');
  }

  refreshToken() {
    return this.httpClient.post<any>('http://localhost:8080/api/auth/refresh/token',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('expiresAt');

        sessionStorage.setItem('token',
          response.authenticationToken);
          sessionStorage.setItem('expiresAt', response.expiresAt);
      }));
  }

  getUserName() {
    return sessionStorage.getItem('authenticantedUser');
  }
  getRefreshToken() {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

}
