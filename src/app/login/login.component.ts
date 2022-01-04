import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  errorMessage = 'Invalid credentials';
  invalidLogin = false;
  

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  handleLogin() {
    this.authenticationService.executeJWTAuthentication(this.username, this.password)
    .subscribe(
      data => {
        this.router.navigateByUrl('news');
      },
      error => {
        console.log(error)
        this.invalidLogin = true
      }
    )
    
  }

  isInvalidLogin() {
    return this.invalidLogin;
  }

}
