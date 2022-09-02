import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../service/news.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  public formGroup: FormGroup;
  public selectedFile: any;
  public event1: any;
  imageUrl: any;
  receivedImageData: any;
  base64Data: any;
  convertedImage: any;
  added = '';

  constructor(public formBuilder: FormBuilder, private newsService: NewsService) {
    this.formGroup = this.formBuilder.group({
      title: [null, [Validators.required, Validators.maxLength(30)]],
      content: [null, [Validators.required, Validators.minLength(20)]],
      source: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.newsService.getImage("2").subscribe(res => {
      this.receivedImageData = res;
      // this.base64Data = this.receivedImageData.pic;
      this.convertedImage = 'data:image/jpeg;base64,' + this.receivedImageData.pic;
      console.log(this.convertedImage);
    }, err => {console.log(err)});
  }

  public onFileChanged(event: any) {
    console.log(event);
    this.selectedFile = event.target.files[0];

    // Below part is used to display the selected image
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.imageUrl = reader.result;
      console.log(reader);
    };

  }

  submit() {
    let id: string = "1";
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    this.newsService.postPost(this.formGroup.value.title, this.formGroup.value.content, this.formGroup.value.source)
      .subscribe(result => console.log(result), err => console.log(err));
    this.newsService.postImage(uploadData, id).subscribe(res => {
      console.log(res);
      this.receivedImageData = res;
      this.base64Data = this.receivedImageData.pic;
      this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data;
    },
      err => console.log('Error Occured duringng saving: ' + err));
    this.formGroup.reset();
    this.added = 'Create completed';
  }

}
