import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { CheckComponent } from './check/check.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewsComponent } from './news/news.component';
import { RouteGuardService } from './service/route-guard.service';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [RouteGuardService], runGuardsAndResolvers: 'always'},
  {path: 'category/:category', component: HomeComponent, canActivate: [RouteGuardService], runGuardsAndResolvers: 'always'},
  {path: 'login', component: LoginComponent},
  {path: 'news/:id', component: NewsComponent, canActivate: [RouteGuardService]},
  {path: 'check', component: CheckComponent, canActivate: [RouteGuardService]},
  {path: 'create-post', component: CreatePostComponent, canActivate: [RouteGuardService]},
  {path: 'sign-up', component: SignupComponent},
  {path: '**', component: LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
