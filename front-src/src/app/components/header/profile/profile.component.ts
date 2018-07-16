import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { User } from '../../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  editMode: boolean = false;
  day: string;
  month: string;
  year: string;
  days: string[] = ['Day', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  months: string[] = ['Month', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: string[] = ['Year', '1920','1921','1922','1923','1924','1925','1926','1927','1928','1929','1930',
  '1931','1932','1933','1934','1935','1936','1937','1938','1939','1940','1941','1942','1943','1944','1945',
  '1946','1947','1948','1949','1950','1951','1952','1953','1954','1955','1956','1957','1958','1959','1960',
  '1961','1962','1963','1964','1965','1966','1967','1968','1969','1970','1971','1972','1973','1974','1975',
  '1976','1977','1978','1979','1980','1981','1982','1983','1984','1985','1986','1987','1988','1989','1990',
  '1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005',
  '2006','2007','2008','2009','2010'];

  constructor(
    private authService: AuthService,
    private toasterService: ToasterService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
    });
  }

  updateProfile(): void {
    this.user.birthday = this.day + '/' + this.month + '/' + this.year;
    this.spinnerService.show();
    this.authService.updateProfile(this.user).subscribe(data => {
      if(data.success) {
        this.toasterService.pop('success', 'Success', data.msg);
      } else {
        this.toasterService.pop('error', 'Error', data.msg);
      }
      this.spinnerService.hide();
    });
    this.editMode = false;
  }

  activateEditMode(): void {
    if (this.user.birthday !== undefined && this.user.birthday !== '') {
      this.day = this.user.birthday.substr(0,2);
      this.month = this.user.birthday.substr(3,2);
      this.year = this.user.birthday.substr(6,4);
    } else {
      this.day = 'Day';
      this.month = 'Month';
      this.year = 'Year';
    }
    this.editMode = true;
  }

  cancelEditMode(): void {
    this.editMode = false;
  }

}
