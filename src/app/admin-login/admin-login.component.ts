import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private route: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLogged();
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  isLogged(): void {
    if (localStorage.getItem('admin')) {
      const admin = JSON.parse(localStorage.getItem('admin'));

      if (admin && admin.role == 'ADMIN') {
        this.route.navigateByUrl('/admin');
      }
    }
  }

  signIn(): void {
    this.authService.signIn(this.email.value, this.password.value);
  }

}
