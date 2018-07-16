import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../models/user';

import { ValidateService } from '../../../services/validate.service';
import { AuthService } from '../../../services/auth.service';
import { ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  firstname: string;
  username: string;
  email: string;
  password: string;
  passwordcheck: string;
  gender: string = '---';
  days: string[] = ['Day', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  months: string[] = ['Month', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: string[] = ['Year', '1920','1921','1922','1923','1924','1925','1926','1927','1928','1929','1930',
  '1931','1932','1933','1934','1935','1936','1937','1938','1939','1940','1941','1942','1943','1944','1945',
  '1946','1947','1948','1949','1950','1951','1952','1953','1954','1955','1956','1957','1958','1959','1960',
  '1961','1962','1963','1964','1965','1966','1967','1968','1969','1970','1971','1972','1973','1974','1975',
  '1976','1977','1978','1979','1980','1981','1982','1983','1984','1985','1986','1987','1988','1989','1990',
  '1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005',
  '2006','2007','2008','2009','2010'];
  day: string = 'Day';
  month: string = 'Month';
  year: string = 'Year';

  msgName: boolean;
  msgFirstname: boolean;
  msgUsername: boolean;
  msgEmail: boolean;
  msgPassword: boolean;
  msgPasswordcheck: boolean;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private toasterService: ToasterService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
  }

  validateName(): void {
    if(this.name === '' || this.name === undefined) {
      this.msgName = true;
    } else {
      this.msgName = false;
    }
  }

  validateFirstname(): void {
    if(this.firstname === '' || this.firstname === undefined) {
      this.msgFirstname = true;
    } else {
    this.msgFirstname = false;
    }
  }

  validateUsername(): void {
    if(this.username === '' || this.username === undefined) {
      this.msgUsername = true;
    } else {
      this.msgUsername = false;
    }
  }

  validateEmail(): void {
    if(!this.validateService.validateEmail(this.email)) {
      this.msgEmail = true;
    } else {
      this.authService.checkMail(this.email).subscribe(data => {
        if(!data.success) {
          this.msgEmail = true;
        } else {
          this.msgEmail = false;
        }
      });
    }
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

  onRegisterSubmit() : boolean {
    const user: User = {
      name: this.name,
      firstname: this.firstname,
      username: this.username,
      email: this.email,
      password: this.password,
      birthday: this.day + '/' + this.month + '/' + this.year,
      gender: this.gender
    }

    //Register fields
    if(!this.validateService.validateRegister(user)) {
      this.toasterService.pop('error', 'Cannot register', 'Please fill all the mandatory fields');
      return false;
    }

    //Check Email
    if(!this.validateService.validateEmail(user.email)) {
      this.toasterService.pop('error', 'Cannot register', 'Please use a valid email');
      return false;
    }

    //Check password
    if(!this.validateService.validatePassword(user.password)) {
      this.toasterService.pop('error', 'Cannot register', 'Not a valid password. Must contain: 8 caracters minimum with at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special caracter.');
      return false;
    }

    //Check confirm password
    if(this.password !== this.passwordcheck) {
      this.toasterService.pop('error', 'Cannot register', 'Please use the same password for confirmation');
      return false;
    }

    //Register user
    this.spinnerService.show();
    this.authService.registerUser(user).subscribe(data => {
      if(data.success) {
        this.toasterService.pop('success', 'Email sent', 'Please check your mailbox and confirm your registration');
        this.router.navigate(['/']);
      } else {
        this.toasterService.pop('error', 'Cannot register', data.msg);
        this.router.navigate(['/register']);
      }
      this.spinnerService.hide();
    });

  }

}
