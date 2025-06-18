import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  login(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/login`, body);
  }

  signUp(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/signup`, body);
  }

  resetPassword(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/reset-password`, body);
  }

  confirmEmail(email: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/confirm-email/${email}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${environment.apiUrl}/users/check-email/${email}`)
      .pipe(map(response => response.exists));
  }

  checkEmailVerified(email: string): Observable<boolean> {
    return this.http.get<{ verified: boolean }>(`${environment.apiUrl}/users/check-email-verified/${email}`)
      .pipe(map(response => response.verified));
  }
}
