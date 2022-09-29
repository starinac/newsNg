import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../app.const';
import { AuthService } from '../auth/shared/auth.service';
import { CategoryPayload } from '../shared/category.payload';
import { CommentPayload } from '../shared/comment.payload';
import { FavoritePayload } from '../shared/favorite.payload';
import { PostModel } from '../shared/post-model';
import { AUTHENTICATED_USER } from './authentication.service';

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

  getPost(postId: number) {
    return this.http.get<PostModel>('http://localhost:8080/post/' + postId);
  }

  getAllCommentsForPost(postId: number): Observable<CommentPayload[]> {
    return this.http.get<CommentPayload[]>('http://localhost:8080/comments/' + postId);
  }

  postComment(commentPayload: CommentPayload): Observable<any> {
    return this.http.post<any>('http://localhost:8080/comments/', commentPayload);
  }

  getAllCommentsByUser(name: string) {
    return this.http.get<CommentPayload[]>('http://localhost:8080/comments/by-user/' + name);
  }

  getCategories() {
    return this.http.get<CategoryPayload[]>('http://localhost:8080/categories');
  }

  getAllPostsForCategory(category: string) {
    return this.http.get<Array<PostModel>>('http://localhost:8080/post/category/' + category);
  }

  addToFavorites(favoritesPayload: FavoritePayload) {
    return this.http.post<any>('http://localhost:8080/favorites/', favoritesPayload);
  }

  getFavorites() {
    const userName = sessionStorage.getItem(AUTHENTICATED_USER);
    return this.http.get<FavoritePayload[]>('http://localhost:8080/favorites/' + userName);
  }

  removeFavorite(favoritesPayload: FavoritePayload) {
    return this.http.delete<any>(`http://localhost:8080/favorites/${favoritesPayload.postId}`);
  }

  postPost(
    title: string,
    content: string,
    source: string,
    selectedCategory: number,
    selectedSubCategory: number) {
    const category = selectedSubCategory ? selectedSubCategory : selectedCategory;
    return this.http.post('http://localhost:8080/post', {
      title: title,
      content: content,
      source: source,
      categoryId: category
    }, { responseType: "json" })
  }

  postImage(uploadData: any, id: string) {
    return this.http.post(`http://localhost:8080/image/upload/${id}`, uploadData);
  }

  getImage(id: string) {
    return this.http.get(`http://localhost:8080/image/${id}`, { responseType: "arraybuffer" })
  };

  importNews(category: string) {
    return this.http.get(`https://newsapi.org/v2/top-headlines?country=rs&category=${category}&pageSize=1&apiKey=d2a0c39e5a7b45eaade119e33fdbb764`);
  }

  postImportedNews(posts: PostModel[]) {
    posts.forEach(post => {
      this.http.post('http://localhost:8080/post', post).subscribe(data => console.log(data), err => console.log(err));
    })
  }

  checkPayment() {
    const username = sessionStorage.getItem(AUTHENTICATED_USER);
    return this.http.get<any>('http://localhost:8080/auth/check/' + username);
  }
}
