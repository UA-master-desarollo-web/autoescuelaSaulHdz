import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ToastService,
  ToastStatus,
} from '../../shared/components/toast/toast.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z ]*$'),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z ]*$'),
    ]),
    DNI: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern('^[a-zA-Z][0-9]{7}[a-zA-Z]$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      // custom validator
      this.passwordMatchValidator.bind(this),
    ]),
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  get name() {
    return this.registerForm.get('name');
  }
  get lastname() {
    return this.registerForm.get('lastname');
  }
  get DNI() {
    return this.registerForm.get('DNI');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // custom validator to check the password confirmation matches the password
  passwordMatchValidator(control: FormControl): { [s: string]: boolean } {
    if (
      this.registerForm &&
      control.value !== this.registerForm.get('password')?.value
    ) {
      return { passwordMismatch: true };
    }
    return {};
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.toast.showToast('Error', 'Formulario invalido', ToastStatus.Error);
      return;
    }

    this.authService.registerUser({
      name: this.name?.value ?? '', // Add null check and access value property
      lastname: this.lastname?.value ?? '', // Add null check and access value property
      DNI: this.DNI?.value ?? '', // Add null check and access value property
      email: this.email?.value ?? '', // Add null check and access value property
      password: this.password?.value ?? '', // Add null check and access value property
    });

    this.toast.showToast('Exito', 'Usuario registrado', ToastStatus.Success);
    // Redirect to login
    this.router.navigate(['/']);
    this.registerForm.reset();
  }
}
