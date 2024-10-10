// category.admin.component.ts
declare var bootstrap: any;
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/service/category.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: ['./category.admin.component.scss']
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  pages:number[] = [];
  visiblePages: number[] = [];
  keyword:string = "";
  newCategoryName: string = '';
  selectedCategory: Category | null = null;
  updatedCategoryName: string = '';
  

  @ViewChild('createCategoryModal') createCategoryModal!: ElementRef;
  @ViewChild('editCategoryModal') editCategoryModal!: TemplateRef<any>;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllCategories(this.keyword, this.currentPage, this.itemsPerPage);
  }

  
  

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
      }
    });
  }
  searchCategories() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getAllCategories(this.keyword, this.currentPage, this.itemsPerPage);
  }

  
  getAllCategories(keyword: string, page: number, limit: number) {
    this.categoryService.getAllCategories(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.categories = response.categoryList;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching categories: ', error);
      }
    });
  }


  onPageChange(page: number) {
    this.currentPage = page - 1;
    this.getAllCategories(this.keyword, this.currentPage, this.itemsPerPage);
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

  deleteCategory(id: number) {
    const confirmation = window.confirm('Bạn có muốn xóa loại sản phẩm ?');
    if (confirmation) {
      this.categoryService.deleteCategory(id).subscribe({
        next: (response:any) => {
          debugger
          location.reload();
        },
        complete: () => {
          debugger
        },
        error: (error:any) => {
          debugger
          console.error('Error fetching products:', error)
        }
      });
    }
  }


  openCreateModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
  
  closeCreateModal() {
    this.modalService.dismissAll();
  }

  createCategory() {
    if (this.newCategoryName.trim() === '') {
      alert('Tên loại sản phẩm không được để trống!');
      return;
    }

    const newCategory: Category = {
      id: 0, // hoặc để trống tùy vào cách backend xử lý
      name: this.newCategoryName,
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.closeCreateModal();
        this.getAllCategories(this.keyword, this.currentPage, this.itemsPerPage);
        this.newCategoryName = ''; // Xóa giá trị input sau khi tạo
      },
      error: (error) => {
        console.error('Error creating category:', error);
        alert('Không thể tạo loại sản phẩm, vui lòng thử lại sau.');
      }
    });
  }

  openEditModal(category: Category) {
    this.selectedCategory = category;
    this.updatedCategoryName = category.name;
    this.modalService.open(this.editCategoryModal, { centered: true });
  }

  closeEditModal() {
    this.selectedCategory = null;
    this.updatedCategoryName = '';
    this.modalService.dismissAll();
  }

  updateCategory(): void {
    if (this.selectedCategory) {
      const updatedCategory: Category = {
        ...this.selectedCategory,
        name: this.updatedCategoryName
      };

      this.categoryService.updateCategory(this.selectedCategory.id, updatedCategory).subscribe({
        next: (response: string) => {
          alert(response);
          this.getAllCategories(this.keyword, this.currentPage, this.itemsPerPage);
          this.closeEditModal(); // Đóng modal sau khi cập nhật
        },
        error: (error) => {
          console.error('Error updating category:', error);
          alert('Không thể cập nhật loại sản phẩm, vui lòng thử lại sau.');
        }
      });
    }
  }

  
  
}
