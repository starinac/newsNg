import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.const';
import { AuthService } from '../auth/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  payedSubscription(){
    const username = this.authService.getUserName();
    this.http.get(`${API_URL}/post/payed/${username}`).subscribe(data =>{
      console.log(data)
    }, (err) => {
      console.log(err);
    });
  }
}
