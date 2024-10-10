import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpEventType,HttpEvent, HttpHeaders, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Product } from "../models/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiGetProducts = `${environment.apiBaseUrl}/products`;

    constructor(private http: HttpClient) {}

    getProducts(keyword:string, categoryId:number, page: number, limit: number): Observable<Product[]> {
        const params = new HttpParams()
        .set('keyword', keyword)
        .set('category_id', categoryId)
        .set('page', page.toString())
        .set('limit', limit.toString())
        return this.http.get<Product[]>(this.apiGetProducts, {params});
    }

    getDetailProduct(productId: number) {
        return this.http.get(`${environment.apiBaseUrl}/products/${productId}`);
    }

    getProductsByIds(productIds: number[]): Observable<Product[]> {
        debugger
        const params = new HttpParams().set('ids', productIds.join(','));
        return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, {params});
    }


    deleteProduct(productId: number): Observable<any> {
        const url = `${environment.apiBaseUrl}/products/${productId}`;
        return this.http.delete(url, {responseType: 'text'});
    }

    createProduct(product: Product, files: File[], thumbnail: File | null): Observable<Product> {
        const formData = new FormData();
        
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('description', product.description);
        formData.append('face_size', product.face_size.toString());
        formData.append('thickness', product.thickness.toString());
        formData.append('face_color', product.face_color);
        formData.append('machine_type', product.machine_type);
        formData.append('wire_size', product.wire_size.toString());
        formData.append('glass_surface', product.glass_surface);
        formData.append('wire_material', product.wire_material);
        formData.append('categoryId', product.category_id.toString());
    
        if (thumbnail) {
            formData.append('thumbnail', thumbnail, thumbnail.name);
          }

        product.product_images.forEach((image, index) => {
            formData.append(`productImages[${index}].imageUrl`, image.image_url); 
            formData.append(`productImages[${index}].productId`, image.product_id.toString()); 
        });
    
        files.forEach((file) => {
            formData.append('files', file, file.name);
        });
    
        const url = `${environment.apiBaseUrl}/products`;
        return this.http.post<Product>(url, formData);
    }

    updateProduct(product: Product, files: File[], thumbnail: File | null): Observable<Product> {
        const formData = new FormData();
        
        formData.append('id', product.id.toString());
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('description', product.description);
        formData.append('face_size', product.face_size.toString());
        formData.append('thickness', product.thickness.toString());
        formData.append('face_color', product.face_color);
        formData.append('machine_type', product.machine_type);
        formData.append('wire_size', product.wire_size.toString());
        formData.append('glass_surface', product.glass_surface);
        formData.append('wire_material', product.wire_material);
        formData.append('categoryId', product.category_id.toString());
    
        // Append thumbnail if present
        if (thumbnail) {
            formData.append('thumbnail', thumbnail, thumbnail.name);
        }
    
        // Append product images
        product.product_images.forEach((image, index) => {
            formData.append(`productImages[${index}].imageUrl`, image.image_url); // Adjust if necessary
            formData.append(`productImages[${index}].productId`, image.product_id.toString()); // Adjust if necessary
        });
    
        // Append image files
        files.forEach((file) => {
            formData.append('files', file, file.name);
        });
    
        const url = `${environment.apiBaseUrl}/products/${product.id}`;
        return this.http.put<Product>(url, formData);
    }    

    // product.service.ts
    // product.service.ts
    deleteAllImagesByProductId(id: number): Observable<string> {
        return this.http.delete(`${environment.apiBaseUrl}/products/${id}/images`, { responseType: 'text' });
    }
  
  
}