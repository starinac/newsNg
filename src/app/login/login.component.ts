import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  invalidLogin = false;
  

  constructor(private router: Router, private authenticationService: AuthenticationService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  handleLogin() {
    this.authenticationService.executeJWTAuthentication(this.username, this.password)
    .subscribe(
      data => {
        this.router.navigateByUrl('/');
      },
      error => {
        this.toastr.error("Bad credentials");
        console.log(error)
      }
    )
    
  }

  isInvalidLogin() {
    return this.invalidLogin;
  }

}
