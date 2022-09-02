import { Component, OnInit } from '@angular/core';
import { PostModel } from '../shared/post-model';
import { NewsService } from '../service/news.service'
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<PostModel> = [];

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  private getPosts(){
    this.newsService.getAllPosts().subscribe(data => {
      this.posts = data;
    }, error => {
      throwError(error);
    })
  }

}
