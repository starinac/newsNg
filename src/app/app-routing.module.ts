import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { CheckComponent } from './check/check.component';
import { LoginComponent } from './login/login.component';
import { NewsComponent } from './news/news.component';
import { RouteGuardService } from './service/route-guard.service';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "news", component: NewsComponent, canActivate: [RouteGuardService]},
  {path: "check", component: CheckComponent, canActivate: [RouteGuardService]},
  {path: "sign-up", component: SignupComponent},
  {path: "**", component: LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
