import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { NewsService } from '../service/news.service';
import { CategoryPayload } from '../shared/category.payload';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  public createPostForm: FormGroup;
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

  constructor(public formBuilder: FormBuilder, private router: Router, private newsService: NewsService, private sanitizer: DomSanitizer) {
    // this.formGroup = this.formBuilder.group({
    //   title: [null, [Validators.required, Validators.maxLength(30)]],
    //   content: [null, [Validators.required, Validators.minLength(20)]],
    //   source: [null, [Validators.required]]
    // })
    this.createPostForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      content: new FormControl(null, [Validators.required, Validators.minLength(20)]),
      source: new FormControl('', Validators.required),
    });
    this.categories = [];
    this.mainCategories = [];
    this.subCategories = [];
  }

  ngOnInit(): void {
    this.getCategories();
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
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    this.newsService.postPost(this.createPostForm.value.title, this.createPostForm.value.content, this.createPostForm.value.source, this.selectedCategory, this.selectedSubCategory)
      .subscribe((result: any) => {
        console.log(result);
        this.newsService.postImage(uploadData, result['postId']).subscribe(res => {
          console.log(res);
          this.receivedImageData = res;
          this.base64Data = this.receivedImageData.pic;
          this.uploadedImage = 'data:image/jpeg;base64,' + res;
        },
          err => console.log('Error Occured during saving: ' + err));
      }, err => console.log(err));

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

  onSelect(category: any) {
    this.subCategories = this.categories.filter(c => c.parentId == category.target.value);
    this.selectedCategory = category.target.value;
    console.log(this.selectedCategory);
  }

  onSelectSub(category: any) {
    this.selectedSubCategory = category.target.value;
    console.log(this.selectedSubCategory);
  }

}
