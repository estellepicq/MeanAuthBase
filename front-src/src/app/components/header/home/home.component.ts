import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  website = environment.website;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

}
