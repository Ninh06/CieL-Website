import { afterNextRender, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUserDTO } from 'src/app/dtos/user/update.user.dto';
import { UserResponse } from 'src/app/reponses/user/user.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userResponse?: UserResponse;
  userProfileForm: FormGroup;
  token: string = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fromBuilder: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    
    
  ) {
    this.userProfileForm = this.fromBuilder.group({
      full_name: [''],
      address: ['',[Validators.minLength(3)]],
      phone_number: ['', [Validators.minLength(10)]],
      password: ['', [Validators.minLength(3)]],
      retype_password: ['', [Validators.minLength(3)]],
      date_of_birth: [Date.now()]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  ngOnInit(): void {
      debugger
      this.token= this.tokenService.getToken() ?? '';
      this.userService.getUserDetail(this.token).subscribe({
        next: (response: any) => {
          debugger
          this.userResponse = {
            ...response,
            date_of_birth: new Date(response.date_of_birth)
          };
          this.userProfileForm.patchValue({
            full_name: this.userResponse?.full_name ?? '',
            address: this.userResponse?.address ?? '',
            date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10),
          })
          this.userService.saveUserResponseToLocalStorage(this.userResponse);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error.message);
        }
      })
  }
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retype_password = formGroup.get('retype_password')?.value;
      if(password !== retype_password) {
        return {passwordMismatch: true}
      }

      return null;
    }
  }
  save():void {
    debugger
    if(this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        full_name: this.userProfileForm.get('full_name')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('dateOfBirth')?.value
      };

      this.userService.updateUserDetail(this.token, updateUserDTO).subscribe({
        next: (response: any) => {
          this.userService.removeUserFromLocalStorage();
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          alert(error.error.message);
        }
      });
    } else {
      if(this.userProfileForm.hasError('passwordMismatch')) {
        alert('Mật khẩu và mật khẩu nhập lại chưa chính xác')
      }
    }
  }
}