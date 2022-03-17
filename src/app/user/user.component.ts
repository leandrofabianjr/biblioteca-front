import { Component, OnInit } from '@angular/core';
import { CollectionStats, StatsService } from '../services/stats.service';
import { CollectionType } from '../services/base-dto.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppUser } from '../models/user.';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  stats = {
    items: {} as CollectionStats,
    authors: {} as CollectionStats,
    genres: {} as CollectionStats,
    locations: {} as CollectionStats,
    publishers: {} as CollectionStats,
  };

  user?: AppUser;

  constructor(
    public afs: AngularFirestore,
    public auth: AuthService,
    afAuth: AngularFireAuth
  ) {
    new StatsService(afs, CollectionType.Items, afAuth)
      .get()
      .subscribe((s) => (this.stats.items = s ?? ({} as CollectionStats)));
    new StatsService(afs, CollectionType.Authors, afAuth)
      .get()
      .subscribe((s) => (this.stats.authors = s ?? ({} as CollectionStats)));
    new StatsService(afs, CollectionType.Genres, afAuth)
      .get()
      .subscribe((s) => (this.stats.genres = s ?? ({} as CollectionStats)));
    new StatsService(afs, CollectionType.Locations, afAuth)
      .get()
      .subscribe((s) => (this.stats.locations = s ?? ({} as CollectionStats)));
    new StatsService(afs, CollectionType.Publishers, afAuth)
      .get()
      .subscribe((s) => (this.stats.publishers = s ?? ({} as CollectionStats)));
  }

  ngOnInit() {
    this.auth.currentUser.subscribe((user) => (this.user = user));
  }
}
