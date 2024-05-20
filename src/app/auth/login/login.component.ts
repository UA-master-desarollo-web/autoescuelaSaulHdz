import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import {
  ToastService,
  ToastStatus,
} from '../../shared/components/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    private toastSerice: ToastService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submitLogin() {
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    if (this.auth.login(email, password)) {
      this.loginForm.reset();
      const redirectUrl = this.auth.redirectUrl ?? '/dashboard';
      this.router.navigate([redirectUrl]);
      this.toastSerice.showToast(
        'Welcome',
        'You have successfully logged in',
        ToastStatus.Success
      );
    } else {
      this.loginForm.reset();
      this.toastSerice.showToast(
        'Error',
        'Invalid email or password',
        ToastStatus.Error
      );
    }
  }
}
