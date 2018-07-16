import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
  }

  onLogoutClick(): Boolean {
    this.authService.logout();
    this.toasterService.pop('success', 'Success', 'You are logged out');
    this.router.navigate(['/']);
    return false;
  }

}
