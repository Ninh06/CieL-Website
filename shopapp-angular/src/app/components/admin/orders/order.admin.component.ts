import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderResponse } from 'src/app/reponses/order.response';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss']
})
export class OrderAdminComponent implements OnInit {
  orders: OrderResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];

  // Map trạng thái từ tiếng Anh sang tiếng Việt để hiển thị
  displayStatusMap: { [key: string]: string } = {
    "pending": "Chưa xử lý",
    "processing": "Đã xử lý",
    "shipped": "Đang giao hàng",
    "delivered": "Đã giao hàng",
    "cancelled": "Hủy đơn"
  };

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchOrders() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        console.log(response);
        // Ánh xạ trạng thái để hiển thị đúng bằng tiếng Việt
        this.orders = response.orders.map((order: OrderResponse) => ({
          ...order,
          status: this.displayStatusMap[order.status] || order.status
        }));
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        console.log('Fetched orders successfully');
      },
      error: (error: any) => {
        console.error('Error fetching orders: ', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page - 1;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let adjustedCurrentPage = currentPage + 1;
    let startPages = Math.max(adjustedCurrentPage - halfVisiblePages, 1);
    let endPages = Math.min(startPages + maxVisiblePages - 1, totalPages);

    if (endPages - startPages + 1 < maxVisiblePages) {
      startPages = Math.max(endPages - maxVisiblePages + 1, 1);
    }

    return new Array(endPages - startPages + 1).fill(0).map((_, index) => startPages + index);
  }

  deleteOrder(id: number) {
    const confirmation = window.confirm('Bạn có muốn xóa đơn hàng?');
    if (confirmation) {
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          location.reload();
        },
        complete: () => {
          console.log('Order deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting order:', error);
        }
      });
    }
  }

  viewDetails(order: OrderResponse) {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
