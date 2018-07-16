import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { User } from '../../../models/user';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  user: User;
  subject: string;
  message: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toasterService: ToasterService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
    });
  }

  onContactSubmit() {
    if(this.subject !== undefined && this.message !== undefined) {
      this.spinnerService.show();
      this.authService.sendContactMail(this.user.email, this.subject, this.message).subscribe(data => {
        if(data.success) {
          this.toasterService.pop('success', 'Success', data.msg);
          this.router.navigate(['/']);
        } else {
          this.toasterService.pop('error', 'Error', data.msg);
          this.router.navigate(['/contact']);
        }
        this.spinnerService.hide();
      });
    } else {
      this.toasterService.pop('error', 'Error', 'Please fill all the fields');
    }
  }

}
