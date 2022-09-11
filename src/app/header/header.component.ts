import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/shared/auth.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }


}
