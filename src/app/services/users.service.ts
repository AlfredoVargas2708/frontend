import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  resetPassword(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/reset-password`, body);
  }
}
