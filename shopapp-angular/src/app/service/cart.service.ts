import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    private cart: Map<number, number> = new Map();

    constructor(private productService: ProductService) {
        const storeCart = localStorage.getItem('cart');
        if(storeCart) {
            this.cart = new Map(JSON.parse(storeCart));
        }
    }

    addToCart(productId: number, quantity: number = 1): void {
        debugger
        if(this.cart.has(productId)) {
            this.cart.set(productId, this.cart.get(productId)! + quantity);
        } else {
            this.cart.set(productId, quantity);
        }
        this.saveCartToLocalStorage();
    }

    removeFromCart(productId: number): void {
        if (this.cart.has(productId)) {
        this.cart.delete(productId);
        this.saveCartToLocalStorage(); 
        }
    }
  
    getCart(): Map<number, number> {
        return this.cart;
    }

    private saveCartToLocalStorage(): void {
        localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }

    clearCart(): void {
        this.cart.clear();
        this.saveCartToLocalStorage();
    }
}