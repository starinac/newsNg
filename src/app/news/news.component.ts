import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { NewsService } from '../service/news.service';
import { CommentPayload } from '../shared/comment.payload';
import { FavoritePayload } from '../shared/favorite.payload';
import { PostModel } from '../shared/post-model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  postId: number;
  post!: PostModel;
  favorite!: boolean;
  commentForm: FormGroup;
  commentPayload: CommentPayload;
  favoritePayload: FavoritePayload;
  favorites!: FavoritePayload[];
  comments!: CommentPayload[];

  constructor(private newsService: NewsService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService) {
    this.postId = this.activateRoute.snapshot.params.id;

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentPayload = {
      text: '',
      postId: this.postId,
    };
    this.favoritePayload = {
      postId: this.postId
    }
  }

  ngOnInit(): void {
    this.getPostById();
    this.getCommentsForPost();
    this.favorite = false;
    this.newsService.getFavorites().subscribe(data => {
      data.forEach(element => {
        console.log(element);
        if (element.postId == this.postId) {
          this.favorite = true;
        }
      });
    })

  }

  postComment() {
    this.commentPayload.text = this.commentForm.value.text;
    this.newsService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.value.text = '';
      this.toastr.success("You successfully posted a comment");
      this.getCommentsForPost();
    }, error => {
      this.toastr.error("Some error occurred while trying to post a comment");
      throwError(error);
    })
  }

  private getPostById() {
    this.newsService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    })
  }

  private getCommentsForPost() {
    this.newsService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data;
    }, (error) => {
      throwError(error);
    });
  }

  addToFavorites() {
    this.newsService.addToFavorites(this.favoritePayload).subscribe(data => {
      this.favorite = true;
      this.toastr.success("You successfully added post to favorites");
    }, error => {
      this.toastr.error("Some error occurred while trying to add post to favorites.");
      throwError(error);
    })
  }

  removeFavorite() {
    this.newsService.removeFavorite(this.favoritePayload).subscribe(data => {
      this.favorite = false;
      this.toastr.success("You successfully removed post from favorites");
    }, error => {
      this.toastr.error("Some error occurred while trying to remove post from favorites.");
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
