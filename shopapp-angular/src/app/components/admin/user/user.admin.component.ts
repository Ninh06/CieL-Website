import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { UserResponse } from 'src/app/reponses/user/user.response';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user.admin.component.html',
  styleUrls: ['./user.admin.component.scss']
})
export class UserAdminComponent implements OnInit {
  users: UserResponse[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  itemsPerPage: number = 12;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getUsers(keyword: string, page: number, limit: number): void {
    this.userService.getUsers(keyword, page, limit).subscribe(
        (response: any) => {
            this.users = response.userResponses; 
            this.currentPage = response.page !== undefined ? response.page : 0; 
            this.totalPages = response.totalPages !== undefined ? response.totalPages : 1; 
            this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        (error) => {
            console.error('Error fetching users:', error);
        }
    );
  }
  
  activateUser(userId: number): void {
    if (window.confirm('Bạn có chắc chắn muốn kích hoạt tài khoản này không?')) {
      this.userService.activateUser(userId).subscribe(
        (response: string) => {
          this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
        },
        (error) => {
          console.error('Error activating user:', error);
        }
      );
    }
  }
  
  deleteUser(userId: number): void {
    if (window.confirm('Bạn có chắc chắn muốn tắt tài khoản này không?')) {
      this.userService.deleteUser(userId).subscribe(
        (response: string) => {
          this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
  
  

  onPageChange(page: number) {
    this.currentPage = page - 1;
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }
    
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
      
    currentPage = currentPage !== undefined ? currentPage : 0;
    let adjustedCurrentPage = Math.max(1, Math.min(currentPage + 1, totalPages));
    let startPages = Math.max(adjustedCurrentPage - halfVisiblePages, 1);
    let endPages = Math.min(startPages + maxVisiblePages - 1, totalPages);

    if (endPages > totalPages) {
      endPages = totalPages;
    }
      
    if (endPages - startPages + 1 < maxVisiblePages) {
      startPages = Math.max(endPages - maxVisiblePages + 1, 1);
    }
  
    if (startPages > endPages) {
      startPages = endPages = 1;
    }
      
    return new Array(endPages - startPages + 1).fill(0).map((_, index) => startPages + index);
  }
    
}
