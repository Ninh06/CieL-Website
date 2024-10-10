import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/reponses/user/user.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  adminComponent: string = 'orders';
  userResponse?: UserResponse | null;
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }
  logout():void {
    this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
      this.router.navigate(['/login']);
  }
  showAdminComponent(componentName: string): void {
    if(componentName == 'orders') {
      this.router.navigate(['/admin/orders']);
    } else if(componentName == 'categories') {
      this.router.navigate(['/admin/categories']);
    } else if(componentName == 'products') {
      this.router.navigate(['/admin/products']);
    } else if(componentName == 'users') {
      this.router.navigate(['/admin/users']);
    }
    
  }
}
