import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  getCantidadVentas(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/sales/count`);
  }

  createSale(sale: any, products: any[]): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/sales`, { sale, products });
  }
}
