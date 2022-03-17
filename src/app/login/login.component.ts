import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginError = false;

  constructor(private auth: AuthService, private route: Router) {}

  googleLogin() {
    this.auth.googleLogin().subscribe({
      next: (user) => {
        this.route.navigate(['u', 'items']);
      },
      error: (error) => {
        this.loginError = true;
        console.error(error);
      },
    });
  }
}
