import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  redirectUrl: string | null = null;

  registerUser(user: {
    name: string;
    lastname: string;
    DNI: string;
    email: string;
    password: string;
  }): void {
    const userJson = JSON.stringify(user);
    localStorage.setItem(user.email, userJson);
  }

  findUser(email: string): {
    name: string;
    lastname: string;
    DNI: string;
    email: string;
    password: string;
  } | null {
    const userJson = localStorage.getItem(email);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  login(email: string, password: string): boolean {
    const user = this.findUser(email);
    if (user && user.password === password) {
      this.setLoggedInUser(user);
      return true;
    }
    return false;
  }

  setLoggedInUser(user: {
    name: string;
    lastname: string;
    DNI: string;
    email: string;
    password: string;
  }): void {
    const userJson = JSON.stringify(user);
    sessionStorage.setItem('loggedInUser', userJson);
  }

  getLoggedInUser(): {
    name: string;
    lastname: string;
    DNI: string;
    email: string;
    password: string;
  } | null {
    const userJson = sessionStorage.getItem('loggedInUser');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  logout(): void {
    sessionStorage.removeItem('loggedInUser');
  }
}
