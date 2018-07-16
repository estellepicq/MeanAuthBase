import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.css']
})
export class RegisterConfirmComponent implements OnInit {
  msg: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.confirmRegistration(this.route.snapshot.paramMap.get('token')).subscribe(data => {
      if (data.success) {
        this.authService.authenticateUser(data.user).subscribe(result => {
          if (result.success) {
            this.authService.storeUserData(result.token, result.user);
            this.router.navigate(['/']);
          }
        });
      } else {
        this.msg = data.msg;
      }
    });
  }

}
