import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProduct(code: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products/search/${code}`);
  }

  getProductByName(name: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products/search/name/${name}`);
  }

  getProducts(page: number, pageSize: number): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/products?page=${page}&pageSize=${pageSize}`);
  }

  getCantProducts(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products/count`);
  }

  addProduct(productData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/products`, productData);
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/products/${id}`, productData);
  }

  filterProducts(searchTerm: string, priceRange: any, page: number, pageSize: number): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/products/filter/search?search=${searchTerm}&minValue=${priceRange.min}&maxValue=${priceRange.max}&page=${page}&pageSize=${pageSize}`);
  }
}
