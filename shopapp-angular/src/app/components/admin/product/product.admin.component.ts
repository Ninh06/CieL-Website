import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/app/environments/environment';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product.image';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: ['./product.admin.component.scss']
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  private modalRef: any;

  newProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    face_size: 0,
    thickness: 0,
    face_color: '',
    machine_type: '',
    wire_size: 0,
    glass_surface: '',
    wire_material: '',
    category_id: 0,
    url: '',
    thumbnail: '',
    product_images: []
  };

  selectedThumbnail: File | null = null;
  selectedFiles: File[] = [];
  selectedImages: string[] = [];
  thumbnailPreviewUrl: string | null = null;
 
  

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(0, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        console.log('Categories loaded:', this.categories);
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
      }
    });
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.products.forEach(product => {
          product.product_images.forEach(image => {
            image.image_url = `${environment.apiBaseUrl}/path/to/image/folder/${image.image_url}`;
          });
        });
      },
      error: (error: any) => {
        console.error('Error fetching product: ', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page - 1;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
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

  loadProducts() {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  deleteProduct(id: number) {
    const confirmation = window.confirm('Bạn muốn xóa sản phẩm này đúng không ?');
    if (confirmation) {
      this.productService.deleteProduct(id).subscribe({
        next: (response: any) => {
          this.loadProducts();
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    this.selectedImages = [];
    
    // Hiển thị preview cho các hình ảnh được chọn
    this.selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
  
  onThumbnailSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedThumbnail = event.target.files[0]; 
  
      if (this.selectedThumbnail) { 
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.thumbnailPreviewUrl = e.target.result; 
        };
        reader.readAsDataURL(this.selectedThumbnail);
      }
    }
  }

  createProduct(): void {
    this.newProduct.thumbnail = this.selectedThumbnail ? this.selectedThumbnail.name : '';
    this.productService.createProduct(this.newProduct, this.selectedFiles, this.selectedThumbnail).subscribe({
      next: (createdProduct) => {
        console.log('Product created successfully:', createdProduct);
        this.closeCreateModal(); 
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }

  openCreateModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
  
  closeCreateModal() {
    this.modalService.dismissAll();
  }

  updateProduct(): void {
    const updatedProduct: Product = {
      ...this.newProduct,
      thumbnail: this.selectedThumbnail ? this.selectedThumbnail.name : this.newProduct.thumbnail
    };
  
    const thumbnailToUpdate = this.selectedThumbnail ? this.selectedThumbnail : null;
  
    this.productService.updateProduct(updatedProduct, this.selectedFiles, thumbnailToUpdate).subscribe({
      next: (updatedProduct) => {
        console.log('Product updated successfully:', updatedProduct);
        this.closeUpdateModal();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }

  openUpdateModal(content: TemplateRef<any>, product: Product) {
    this.newProduct = { ...product }; 
    this.selectedThumbnail = null; 
    this.thumbnailPreviewUrl = product.thumbnail
      ? `${environment.apiBaseUrl}/products/images/${product.thumbnail}`
      : null;
    
    this.selectedImages = product.product_images.map(image =>
      `${environment.apiBaseUrl}/products/images/${image.image_url}`
    );

    if (product.category_id) {
      this.newProduct.category_id = product.category_id;
    } else {
      console.warn('Sản phẩm không có category_id');
    }
    
    console.log('Product to update:', this.newProduct);
    
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeUpdateModal() {
    this.modalRef.close();
  }

  
deleteAllImages(): void {
  if (this.newProduct.id) {
    const confirmation = window.confirm('Bạn có chắc chắn muốn xóa tất cả hình ảnh của sản phẩm này không?');
    if (confirmation) {
      this.productService.deleteAllImagesByProductId(this.newProduct.id).subscribe({
        next: (response: string) => {
          console.log('Response from server:', response);
          this.selectedImages = [];
          this.thumbnailPreviewUrl = null;
        },
        error: (error) => {
          console.error('Error deleting all images:', error);
        }
      });
    } else {
      console.log('Hủy bỏ xóa tất cả hình ảnh.');
    }
  } else {
    console.error('Product ID is not set.');
  }
}

viewFullDescription(description: string): void {
  alert(description);
}

}
