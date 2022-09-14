import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/shared/auth.service';
import { AuthenticationService } from '../service/authentication.service';
import { NewsService } from '../service/news.service';
import { CategoryPayload } from '../shared/category.payload';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  categories: CategoryPayload[];
  navigationSubscription: any;

  constructor(public authService: AuthService, private newsService: NewsService, private router: Router) {
    this.categories = [];
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
   }
  initialiseInvites() {
    this.getCategories();
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

  getCategories() {
    this.newsService.getCategories().subscribe(data => {
      this.categories = data;
      console.log(this.categories);
      // this.mainCategories = data.filter(c => c.parentId == 0);
    }, error => {
      console.log(error);
    })
  }

  navigate(category: string) {
    this.router.navigateByUrl(category);
  }


}
