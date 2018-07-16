import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { HomeComponent } from './components/header/home/home.component';
import { ProfileComponent } from './components/header/profile/profile.component';
import { PageNotFoundComponent } from './components/header/page-not-found/page-not-found.component';
import { ContactComponent } from './components/header/contact/contact.component';
import { RegisterConfirmComponent } from './components/auth/register-confirm/register-confirm.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ToasterService } from 'angular2-toaster';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reset/:token', component: ResetPasswordComponent},
  {path: 'confirm/:token', component: RegisterConfirmComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'contact', component: ContactComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    HomeComponent,
    ProfileComponent,
    PageNotFoundComponent,
    ContactComponent,
    RegisterConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    ToasterModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    ToasterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
