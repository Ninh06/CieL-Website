import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { environment } from 'src/app/environments/environment';
import { OrderResponse, OrderDetailResponse } from 'src/app/reponses/order.response';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-detail-order-admin',
  templateUrl: './detail.order.admin.component.html',
  styleUrls: ['./detail.order.admin.component.scss']
})
export class DetailOrderAdminComponent implements OnInit {
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    full_name: '',
    phone_number: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    payment_method: '',
    order_details: []
  };
  orderId!: number;

  // Bản đồ ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
  displayStatusMap: { [key: string]: string } = {
    "pending": "Chưa xử lý",
    "processing": "Đã xử lý",
    "shipped": "Đang giao hàng",
    "delivered": "Đã giao hàng",
    "cancelled": "Hủy đơn"
  };

  // Bản đồ ánh xạ trạng thái từ tiếng Việt sang giá trị tiếng Anh cho backend
  statusMap: { [key: string]: string } = {
    "Chưa xử lý": "pending",
    "Đã xử lý": "processing",
    "Đang giao hàng": "shipped",
    "Đã giao hàng": "delivered",
    "Hủy đơn": "cancelled"
  };

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: OrderResponse) => {
        this.orderResponse = {
          ...response,
          order_date: new Date(response.order_date),
          status: this.displayStatusMap[response.status] || response.status,
          order_details: response.order_details.map((order_detail: OrderDetailResponse) => ({
            ...order_detail,
            product: {
              ...order_detail.product,
              thumbnail: `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`
            }
          }))
        };
      },
      complete: () => {
        console.log('Fetched order details successfully');
      },
      error: (error: any) => {
        console.error('Error fetching detail: ', error);
      }
    });
  }

  handleChangeStatus(): void {
    this.orderResponse.status = this.statusMap[this.orderResponse.status] || this.orderResponse.status;
    console.log('Status changed to:', this.orderResponse.status);
  }

  saveOrder(): void {
    console.log('Status being sent:', this.orderResponse.status);
    this.orderService.updateOrder(this.orderId, new OrderDTO(this.orderResponse)).subscribe({
      next: (response: any) => {
        console.log('Order updated successfully:', response);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      complete: () => {
        console.log('Order save operation completed.');
      },
      error: (error: any) => {
        console.error('Error updating order:', error);
      }
    });
  }
}
