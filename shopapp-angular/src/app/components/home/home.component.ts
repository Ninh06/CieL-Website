import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string ="";

  bannerImages: string[] = [
    'assets/images/new.jpg',
    'assets/images/watch.jpg',
    'assets/images/rolex.jpg',
    'assets/images/rcml.jpg'
  ];
  currentImageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage, this.itemsPerPage);
    this.getCategories(0, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
      }
    })
  }
  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string,selectedCategoryId: number ,page: number, limit: number) {
    this.productService.getProducts(keyword, selectedCategoryId ,page, limit).subscribe({
      next: (response:any) => {
        debugger
        response.products.forEach((product: Product) => {
          debugger
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching product: ', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page - 1; // Convert 1-based to 0-based
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  
    let adjustedCurrentPage = currentPage + 1; // Convert 0-based to 1-based
    let startPages = Math.max(adjustedCurrentPage - halfVisiblePages, 1);
    let endPages = Math.min(startPages + maxVisiblePages - 1, totalPages);
  
    if (endPages - startPages + 1 < maxVisiblePages) {
      startPages = Math.max(endPages - maxVisiblePages + 1, 1);
    }
  
    return new Array(endPages - startPages + 1).fill(0).map((_, index) => startPages + index);
  }
  

  onProductClick(productId: number){
    debugger
    this.router.navigate(['/products', productId]);
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.bannerImages.length) % this.bannerImages.length;
  }

  // Change to the next image
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.bannerImages.length;
  }
}
