import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = '';
  totalAmount: number = 0;
  orderData: OrderDTO = {
    user_id: 0,
    full_name: '',
    phone_number: '',
    address: '',
    note: '',
    status: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: []
  };

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private cartService: CartService,
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      full_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.minLength(5)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.userService.getUserDetail(token).subscribe({
        next: (user) => {
          this.orderForm.patchValue({
            full_name: user.full_name || '',
            phone_number: user.phone_number || '',
            address: user.address || ''
          });
          this.orderData.user_id = user.id;
          console.log('Patched form values:', this.orderForm.value);
        },
        error: (error) => {
          console.error('Error fetching user detail', error);
        }
      });
    }

    this.orderData.user_id = this.tokenService.getUserId();
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    if (productIds.length === 0) {
      return;
    }

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
      },
      complete: () => {
        this.calculateTotal();
      },
      error: (error: any) => {
        console.error('Error fetching detail', error);
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  placeOrder() {
    console.log('Button Place Order clicked');

    // Check if totalAmount is zero before proceeding
    if (this.totalAmount === 0) {
      alert('Không thể đặt hàng vì giỏ hàng trống.');
      return;
    }

    if (this.orderForm.valid) {
      console.log('Order form is valid');

      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };

      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));

      this.orderData.total_money = this.totalAmount;

      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          console.log('Order placed successfully:', response);
          alert("Đặt hàng thành công");
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        complete: () => {
          this.calculateTotal();
        },
        error: (error: any) => {
          console.error('Error placing order:', error);
          alert(`Lỗi khi đặt hàng: ${error}`);
        }
      });
    } else {
      console.log('Order form is invalid:', this.orderForm.errors);
      this.orderForm.markAllAsTouched();
    }
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.calculateTotal();
  }
}
