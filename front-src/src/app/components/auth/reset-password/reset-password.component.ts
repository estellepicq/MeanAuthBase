import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { ValidateService } from '../../../services/validate.service';
import { ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  password: string;
  passwordcheck: string;
  token: string;
  msgPassword: boolean;
  msgPasswordcheck: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private validateService: ValidateService,
    private toasterService: ToasterService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  validatePassword(): void {
    if(!this.validateService.validatePassword(this.password)) {
      this.msgPassword = true;
    } else {
      this.msgPassword = false;
    }
  }

  validatePasswordcheck(): void {
    if(this.password !== this.passwordcheck) {
      this.msgPasswordcheck = true;
    } else {
      this.msgPasswordcheck = false;
    }
  }

  onResetSubmit() {
    const password = this.password;
    const passwordcheck = this.passwordcheck;

    //Check password
    if(!this.validateService.validatePassword(password)) {
      this.toasterService.pop('error', 'Error', 'Not a valid password. Must contain: 8 caracters minimum with at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special caracter.');
      return false;
    }

    if(password !== passwordcheck) {
      this.toasterService.pop('error', 'Error', 'Please use the same password for confirmation');
      return false;
    }

    this.authService.resetPassword(this.token, password).subscribe(data => {
      this.spinnerService.show();
      if(data.success) {
        let user = {
          email: data.user.email,
          password: password
        }
        this.authService.authenticateUser(user).subscribe(result => {
          this.authService.storeUserData(result.token, result.user);
          this.toasterService.pop('success', 'Success', 'You have successfully changed your password');
          this.router.navigate(['/']);
        });
      } else {
        this.toasterService.pop('error', 'Error', 'Something went wrong, please try again');
      }
      this.spinnerService.hide();
    });
  }

}
