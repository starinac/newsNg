import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  registerSuccessMessage: string = '';
  

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
  }

  handleLogin() {
    this.authenticationService.executeJWTAuthentication(this.username, this.password)
    .subscribe(
      data => {
        this.router.navigateByUrl('/');
      },
      error => {
        if(error.error.trace.includes('DisabledException')) {
          this.toastr.error("User not active");
        } else {
          this.toastr.error("Bad credentials");
        }
        console.log(error)
      }
    )
    
  }

  isInvalidLogin() {
    return this.invalidLogin;
  }

}
