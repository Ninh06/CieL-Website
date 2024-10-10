import { ProductImage } from "./product.image";

export interface Product{
    id: number;
    name: string;
    price: number;
    description: string;
    face_size: number;
    thickness: number;
    face_color: string;
    machine_type: string;
    wire_size: number;
    glass_surface: string;
    wire_material: string;
    category_id: number;
    url: string;
    thumbnail: string;
    product_images: ProductImage[];
}