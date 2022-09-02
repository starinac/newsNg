import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../app.const';
import { AuthService } from '../auth/shared/auth.service';
import { PostModel } from '../shared/post-model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  

  constructor(private http: HttpClient, private authService: AuthService) { }

  payedSubscription() {
    const username = this.authService.getUserName();
    this.http.get(`${API_URL}/post/payed/${username}`).subscribe(data => {
      console.log(data)
    }, (err) => {
      console.log(err);
    });
  }

  getAllPosts(): Observable<Array<PostModel>> {
    return this.http.get<Array<PostModel>>('http://localhost:8080/post');
  }

  postPost(
    title: string,
    content: string,
    source: string): Observable<string> {
    return this.http.post('http://localhost:8080/post', {
      title: title,
      content: content,
      source: source
    },
      { responseType: 'text' },)
  }

  postImage(uploadData: any, id: string) {
    return this.http.post(`http://localhost:8080/image/upload/${id}`, uploadData);
  }

  getImage(id: string) {
    return this.http.get(`http://localhost:8080/image/${id}`);
  }

}
