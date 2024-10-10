import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router'; // Import RouterModule và Routes
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TokenInterceptor } from './intercreptors/token.intercreptor';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminModule } from './components/admin/admin.module';
import { IntroduceComponent } from './components/introduce/introduce.component';
// import { AdminComponent } from './components/admin/admin.component';
// import { OrderAdminComponent } from './components/admin/orders/order.admin.component';
// import { DetailOrderAdminComponent } from './components/admin/detail-order/detail.order.admin.component';
// import { ProductAdminComponent } from './components/admin/product/product.admin.component';
// import { CategoryAdminComponent } from './components/admin/category/category.admin.component';

// Cấu hình các tuyến đường (routes)
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product/:id', component: DetailProductComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order-confirm', component: OrderConfirmComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'introduce', component: IntroduceComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, 
];

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailProductComponent,
    OrderComponent,
    OrderConfirmComponent,
    LoginComponent,
    RegisterComponent,
    AppComponent,
    UserProfileComponent,
    IntroduceComponent,
  ],
  imports: [
    AdminModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbPopoverModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent] 
})
export class AppModule { }
