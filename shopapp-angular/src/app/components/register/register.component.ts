import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  //Khai bao cac bien tuong ung voi cac truong du lieu trong form
  phoneNumber: string;
  password: string;
  retype_password: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;

  passwordFieldType: string = 'password';
  retypePasswordFieldType: string = 'password';

  constructor(private router: Router, private userService: UserService) {
          this.phoneNumber = '';
          this.password = '';
          this.retype_password = '';
          this.fullName = '';
          this.address = '';
          this.isAccepted = true;
          this.dateOfBirth = new Date();
          this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);

  }
  loginAccount(event: Event) {
    event.preventDefault(); 
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'retype_password') {
      this.retypePasswordFieldType = this.retypePasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
  
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`)
  }
  register() {
    const message = `phone: ${this.phoneNumber}` + 
      `password: ${this.password}`+
      `retype_password: ${this.retype_password}`+
      `property: ${this.address}`+
      `fullName: ${this.fullName}`+
      `isAccepted: ${this.isAccepted}`+
      `dateOfBirth: ${this.dateOfBirth}`;
    
    const registerDTO : RegisterDTO = {
          "full_name": this.fullName,
          "phone_number": this.phoneNumber,
          "address": this.address,
          "password": this.password,
          "retype_password": this.retype_password,
          "date_of_birth": this.dateOfBirth,
          "facebook_account_id": 0,
          "google_account_id": 0,
          "role_id": 1
    }
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger
        this.router.navigate(['/login']);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        alert(`Cannot register, error: ${error.error}}`)
      }
    });

  }

  checkPasswordsMatch() {
    if(this.password !== this.retype_password) {
      this.registerForm.form.controls['retype_password'].setErrors({'passwordMismatch': true});
    } else {
      this.registerForm.form.controls['retype_password'].setErrors(null);
    }
  }

}
