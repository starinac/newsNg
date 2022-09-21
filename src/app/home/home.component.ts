import { Component, OnInit } from '@angular/core';
import { PostModel } from '../shared/post-model';
import { NewsService } from '../service/news.service'
import { DomSanitizer } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<PostModel> = [];
  category: string = "";
  navigationSubscription: any;

  constructor(private newsService: NewsService, private sanitizer: DomSanitizer, private activateRoute: ActivatedRoute, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }
  initialiseInvites() {
    this.category = this.activateRoute.snapshot.params.category;
    console.log(this.category);
    if (this.category) {
      this.getPostsForCategory(this.category);
    } else {
      this.getPosts();
    }
  }

  ngOnInit(): void {
  }

  getPostsForCategory(category: string) {
    this.newsService.getAllPostsForCategory(category).subscribe(data => {
      this.posts = data;
    }, error => {
      throwError(error);
    });
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
    }, error => {
      throwError(error);
    })
  }

  setDateTime(dateTime: any) {
    const converted = new Date(dateTime * 1000);
    let pipe = new DatePipe('en-US');

    const time = pipe.transform(converted, 'mediumTime', 'UTC');

    const date = pipe.transform(converted, 'MM/dd/yyyy', 'UTC');

    return date + ' ' + time;
  }

}
