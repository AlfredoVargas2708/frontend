import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(private http: HttpClient) { }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/emails/send-password-forgot`, { email });
  }
}
