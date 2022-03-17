import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../services/auth.service';
import { ItemsService } from '../services/items.service';
import { AuthorsService } from '../services/authors.service';
import { GenresService } from '../services/genres.service';
import { PublishersService } from '../services/publishers.service';
import { LocationsService } from '../services/locations.service';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.scss'],
})
export class LoggedComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  loading = true;
  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public auth: AuthService // private itmSrv: ItemsService, // private autSrv: AuthorsService,
  ) // private gnrSrv: GenresService,
  // private pubSrv: PublishersService,
  // private locSrv: LocationsService
  {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    // this.autSrv.loaded.subscribe(() => this.gnrSrv.loadData().subscribe());
    // this.gnrSrv.loaded.subscribe(() => this.pubSrv.loadData().subscribe());
    // this.pubSrv.loaded.subscribe(() => this.locSrv.loadData().subscribe());
    // this.locSrv.loaded.subscribe(() =>
    //   this.itmSrv.loadData().subscribe(() => (this.loading = false))
    // );
    // this.autSrv.loadData().subscribe();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  logout() {
    this.auth.logout();
  }
}
