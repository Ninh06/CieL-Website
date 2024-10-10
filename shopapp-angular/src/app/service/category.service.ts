// category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Category } from 'src/app/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(page: number, limit: number): Observable<Category[]> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString());
    
        return this.http.get<Category[]>(this.apiUrl, { params });
      }

  getAllCategories(keyword:string,
    page:number, limit:number): Observable<Category> {
    const params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get<any>(`${environment.apiBaseUrl}/categories/get-categories-by-keyword`, { params });
  }

  deleteCategory(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  updateCategory(categoryId: number, categoryData: Category): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.put(url, categoryData, { responseType: 'text' });
  }

  createCategory(categoryData: Category): Observable<any> {
    return this.http.post(this.apiUrl, categoryData, { responseType: 'text' });
  }
}
