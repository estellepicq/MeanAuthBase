import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { ValidateService } from '../../../services/validate.service';
import { ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { User } from '../../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private validateService: ValidateService,
    private toasterService: ToasterService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user: User = {
      email: this.email,
      password: this.password
    }
    this.spinnerService.show();
    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.toasterService.pop('success', 'Success', 'You are now logged in');
        this.router.navigate(['/']);
      } else {
        this.toasterService.pop('error', 'Error', data.msg);
        this.router.navigate(['/login']);
      }
      this.spinnerService.hide();
    });
  }

  onForgotPassword() {
    const email = this.email;

    if(this.validateService.validateEmail(email)) {
      this.spinnerService.show();
      this.authService.sendResetMail(email).subscribe((data) => {
        if(data.success) {
          this.spinnerService.hide();
          this.toasterService.pop('success', 'Success', data.msg);
          this.router.navigate(['/']);
        } else {
          this.spinnerService.hide();
          this.toasterService.pop('error', 'Error', data.msg);
        }
      });
    } else {
      this.spinnerService.hide();
      this.toasterService.pop('error', 'Error', 'Please fill your email address');
    }

    return false;
  }

}
