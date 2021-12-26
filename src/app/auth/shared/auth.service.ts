import { Injectable } from '@angular/core';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post('http://localhost:8080/auth/signup', signupRequestPayload, { responseType: 'text' });
  }


}
