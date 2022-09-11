import { Component, OnInit } from '@angular/core';
import { PostModel } from '../shared/post-model';
import { NewsService } from '../service/news.service'
import { DomSanitizer } from '@angular/platform-browser';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<PostModel> = [];

  constructor(private newsService: NewsService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getPosts();
  }

  arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private getPosts() {
    this.newsService.getAllPosts().subscribe(data => {
      console.log(data);
      this.posts = data;
      this.posts.forEach(element => {
        element.imageUrl = this.sanitize('data:image/jpg;base64, ' + this.arrayBufferToBase64(element.image.pic))
      });
    }, error => {
      throwError(error);
    })
  }

}
