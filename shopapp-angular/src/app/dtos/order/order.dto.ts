import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail, IsNumber, ArrayMinSize, ValidateNested } from 'class-validator';
import { CartItemDTO } from './cart.item.dto'; 
import { Type } from 'class-transformer';

export class OrderDTO {

    user_id: number;

    full_name: string;

    phone_number: string;

    address: string;

    note: string;

    status: string;

    total_money: number;

    payment_method: string;

    shipping_method: string;

    coupon_code: string;

    cart_items: {product_id: number, quantity: number}[];

    constructor(data: any) {
        this.user_id = data.user_id;
        this.full_name = data.full_name;
        this.phone_number = data.phone_number;
        this.address = data.address;
        this.note = data.note;
        this.status = data.status;
        this.total_money = data.total_money;
        this.payment_method = data.payment_method;
        this.shipping_method = data.shipping_method;
        this.coupon_code = data.coupon_code;
        this.cart_items = data.cart_items;
        
    }
}
