import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { OrderResponse } from '../reponses/order.response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: OrderDTO): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
  }
  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }
  getAllOrders(keyword:string,
    page:number, limit:number
  ):Observable<OrderResponse[]> {
    const params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get<any>(this.apiGetAllOrders, { params });
  }
  updateOrder(orderId: number, orderData: OrderDTO): Observable<any> {
    console.log('Order id: ', orderId);
    console.log('Order data: ', orderData);
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put(url, orderData);
  }
  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete(url, {responseType: 'text'});
  }
}
