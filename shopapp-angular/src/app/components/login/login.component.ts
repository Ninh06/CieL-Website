import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {LoginResponse} from '../../reponses/user/login.response';
import { TokenService } from 'src/app/service/token.service';
import { RoleService } from 'src/app/service/role.service';
import { Role } from 'src/app/models/role';
import { UserResponse } from 'src/app/reponses/user/user.response';
import { timestamp } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm;
  

  roles: Role[] = [];
  rememberMe: boolean = true;
  selectedRole: Role | undefined;
  userResponse?: UserResponse
  passwordFieldType: string = 'password'; 
  phoneNumber: string = '';
  password: string = '';

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    debugger
    this.roleService.getRoles().subscribe({
      next:(roles: Role[]) => {
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error:(error: any) => {
        debugger
        console.error('Error getting roles:', error);
      }
    });
  }
  createAccount(event: Event) {
    event.preventDefault(); 
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    const iconElement = document.querySelector('.password-toggle') as HTMLElement;
    if (iconElement) {
        iconElement.classList.toggle('fa-eye'); 
        iconElement.classList.toggle('fa-eye-slash'); 
    }
  }


  login() {
    const message = `phone: ${this.phoneNumber}` + 
      `password: ${this.password}`;
      debugger
    
    const loginDTO : LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    }
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        const {token} = response
        if(this.rememberMe) {
          this.tokenService.setToken(token)
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth)
              };

              if (!this.userResponse?.is_active) {
                alert('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
                return;
              }

              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              if(this.userResponse?.role.name == 'admin') {
                this.router.navigate(['/admin']);
              } else if(this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);
              }
            },
            complete: () => {
              debugger
            },
            error: (error: any) => {
              alert(error.error.message)
            }
          })
        }
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        alert('Tài khoản hoặc mật khẩu không đúng')
      }
    });
  }
}
