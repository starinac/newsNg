import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { NewsService } from '../service/news.service';
import { CategoryPayload } from '../shared/category.payload';
import { PostModel } from '../shared/post-model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  public createPostForm: FormGroup;
  public importForm: FormGroup;
  categories: CategoryPayload[];
  mainCategories: CategoryPayload[];
  subCategories: CategoryPayload[];
  selectedCategory!: number;
  selectedSubCategory!: number;

  public selectedFile: any;
  public event1: any;
  imageUrl: any;
  receivedImageData: any;
  base64Data: any;
  convertedImage: any;
  uploadedImage: any;
  added = '';
  payed: boolean = false;

  constructor(public formBuilder: FormBuilder, private router: Router, private newsService: NewsService, private sanitizer: DomSanitizer
    , private toastr: ToastrService) {
    this.createPostForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      content: new FormControl(null, [Validators.required, Validators.minLength(20)]),
      source: new FormControl('', Validators.required),
      categoryName: new FormControl('', Validators.required),
      subCategoryName: new FormControl('')
    });
    this.importForm = new FormGroup({
      categoryName: new FormControl('', Validators.required),
    });
    this.categories = [];
    this.mainCategories = [];
    this.subCategories = [];
  }

  ngOnInit(): void {
    this.getCategories();
    this.checkPayment();
  }

  public onFileChanged(event: any) {
    console.log(event);
    this.selectedFile = event.target.files[0];

    // Below part is used to display the selected image
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.imageUrl = reader.result;
    };

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

  createPost() {
    if (!this.createPostForm.valid) {
      this.toastr.error("Form is not valid!");
      return;
    }
    if(this.selectedFile == null) {
      this.toastr.error("Image is not selected!");
      return;
    }
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    this.newsService.postPost(this.createPostForm.value.title,
      this.createPostForm.value.content,
      this.createPostForm.value.source,
      this.createPostForm.value.categoryName,
      this.createPostForm.value.subCategoryName)
      .subscribe((result: any) => {
        this.toastr.success("You successfully saved new post");
        this.newsService.postImage(uploadData, result['postId']).subscribe(res => {
          console.log(res);
          this.receivedImageData = res;
          this.base64Data = this.receivedImageData.pic;
          this.uploadedImage = 'data:image/jpeg;base64,' + res;
        },
          err => console.log('Error Occured during saving: ' + err));
      }, err => this.toastr.error("Some error occurred while trying to create new post."));

    this.createPostForm.reset();
    this.added = 'Create completed';
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }

  getCategories() {
    this.newsService.getCategories().subscribe(data => {
      this.categories = data;
      this.mainCategories = data.filter(c => c.parentId == 0);
    }, error => {
      console.log(error);
    })
  }

  checkPayment() {
    this.newsService.checkPayment().subscribe(data => {
      this.payed = data.payed;
    }, error => {
      console.log(error);
    })
  }

  onSelect(category: any) {
    this.subCategories = this.categories.filter(c => c.parentId == category.target.value);
  }

  importNews() {
    if(this.importForm.value.categoryName == '') {
      this.toastr.error("Please select category to import");
      return;
    }
    this.newsService.importNews(this.importForm.value.categoryName).subscribe((data: any) => {
      const posts: PostModel[] = this.mapToPost(data.articles);
      this.newsService.postImportedNews(posts);
      this.toastr.success("You successfully imported posts");
    }, error => {
      this.toastr.error("Some error occurred while trying to import posts");
    })
  }

  mapToPost(data: any): PostModel[] {
    let posts: PostModel[] = [];
    data.forEach((element: any) => {
      let post: PostModel = new PostModel;
      post.title = element.title;
      post.source = element.source.name;
      post.content = element.content;
      post.datePublished = element.publishedAt;
      post.imageUrl = element.urlToImage;
      post.urlToPost = element.url;
      post.categoryId = this.mapCategory();
      posts.push(post);
    });
    return posts;
  }

  mapCategory() {
    switch(this.importForm.value.categoryName) {
      case 'business':
        return 1
      case 'sports':
        return 2
      case 'entertainment':
        return 4
      default:
        return 1
    }
  }

  goToPay() {
    this.router.navigateByUrl('check');
  }
}
