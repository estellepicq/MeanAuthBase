import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user: User): boolean {
    if(user.name === undefined || user.username === undefined || user.email === undefined || user.password === undefined ||
       user.name === "" || user.username === "" || user.email === "" || user.password === "") {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email: string): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword(password: string) {
    var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(password);
  }

}
