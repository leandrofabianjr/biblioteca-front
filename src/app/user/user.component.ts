import { Component } from '@angular/core';
import { User } from 'app/models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  user!: User;
  constructor(auth: AuthService) {
    console.log('rtertrte');
    this.user = auth.currentUser;
  }
}
