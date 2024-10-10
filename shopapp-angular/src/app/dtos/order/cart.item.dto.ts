import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartItemDTO {
    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    constructor(data: any) {
        this.product_id = data.product_id;
        this.quantity = data.quantity;
    }
}
