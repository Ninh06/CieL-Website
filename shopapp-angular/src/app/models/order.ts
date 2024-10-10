import { OrderDetail } from './order.detail';

export interface Order {
  id: number;
  user_id: number;
  full_name: string;
  phone_number: string;
  address: string;
  note: string;
  order_date: Date;
  status: string;
  total_money: number;
  shipping_method: string;
  payment_method: string;
  order_details: OrderDetail[];
}


