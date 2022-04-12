import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/user';
import { MeService, UserStats } from 'app/services/me.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  loading = true;
  user!: User;
  stats!: UserStats;
  userPhoto!: string;

  constructor(private meService: MeService) {}

  ngOnInit(): void {
    this.user = AuthService.currentUser;
    this.meService
      .getPhotoUrl()
      .subscribe({ next: (photo) => (this.userPhoto = photo) });
    this.meService.getStats().subscribe({
      next: (stats) => (this.stats = stats),
      error: (err) => console.error(err),
      complete: () => (this.loading = false),
    });
  }
}
