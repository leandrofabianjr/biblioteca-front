import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = true;
  loginError = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      const jwt = params['jwt'];
      if (jwt) {
        this.doLoginWithJwt(jwt);
      } else {
        this.loading = false;
      }
    });
  }

  doLoginWithJwt(jwt: string) {
    this.auth.loginWithJwt(jwt).subscribe({
      next: () => {
        this.router.navigate(['u', 'me']);
      },
      error: (err) => {
        this.loginError = true;
        console.error(err);
      },
    });
  }
}
