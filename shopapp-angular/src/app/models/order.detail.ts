import { Product } from "./product";


export interface OrderDetail {
  product: Product;
  numberOfProducts: number;
  total_money: number;
  price: number;
}
