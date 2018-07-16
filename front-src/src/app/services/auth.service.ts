import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../models/user';
import { ApiResponse } from '../apiResponse';

import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
  private serverUrl = environment.serverUrl;
  authToken: any;
  user: User;

  constructor(
    private http: HttpClient
  ) { }

  checkMail(email: string): Observable<ApiResponse> {
    return this.http.get(`${this.serverUrl}/users/newmail/${email}`, httpOptions)
  }

  registerUser(user: User): Observable<ApiResponse> {
    return this.http.post(`${this.serverUrl}/users/register`, user, httpOptions);
  }

  authenticateUser(user: User): Observable<ApiResponse> {
    return this.http.post(`${this.serverUrl}/users/authenticate`, user, httpOptions);
  }

  getProfile(): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.append('Authorization', this.authToken);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(`${this.serverUrl}/users/profile`, {headers: headers});
  }

  updateProfile(user): Observable<ApiResponse> {
    return this.http.put(`${this.serverUrl}/users/edit/${user._id}`, {birthday: user.birthday, gender: user.gender}, httpOptions)
  }

  sendResetMail(email: string): Observable<ApiResponse> {
    return this.http.post(`${this.serverUrl}/password/mail`, {email: email}, httpOptions);
  }

  resetPassword(token: string, password: string): Observable<ApiResponse> {
    return this.http.post(`${this.serverUrl}/password/reset/${token}`, {password: password}, httpOptions);
  }

  sendContactMail(email: string, subject: string, message: string): Observable<ApiResponse> {
    return this.http.post(`${this.serverUrl}/contact/mail`, {email: email, subject: subject, message: message}, httpOptions);
  }

  confirmRegistration(token: string): Observable<ApiResponse>{
    return this.http.put(`${this.serverUrl}/users/register/confirm/${token}`, httpOptions);
  }

  storeUserData(token: string, user: User): void {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(): void {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(): boolean {
    this.loadToken();
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.authToken);
  }

  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
