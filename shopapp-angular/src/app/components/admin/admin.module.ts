import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { OrderAdminComponent } from "./orders/order.admin.component";
import { DetailOrderAdminComponent } from "./detail-order/detail.order.admin.component";
import { ProductAdminComponent } from "./product/product.admin.component";
import { CategoryAdminComponent } from "./category/category.admin.component";
import { AdminRoutingModule } from "./admin-routinh.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserAdminComponent } from "./user/user.admin.component";

@NgModule({
    declarations: [
        AdminComponent,
        OrderAdminComponent,
        DetailOrderAdminComponent,
        ProductAdminComponent,
        UserAdminComponent,
        CategoryAdminComponent
    ],
    imports:[
        AdminRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AdminModule {}