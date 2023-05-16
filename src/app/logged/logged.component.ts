import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/dialog-confirmation/dialog-confirmation.component';
import { MeService } from 'app/services/me.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.scss'],
})
export class LoggedComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  loading = true;
  hide = false;
  private mobileQueryListener: () => void;
  lastScrollTop = 0;
  userPhoto?: string;
  sidenavOpened = false;
  sidenavAlwaysOpened = false;
  userName = '';

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public auth: AuthService,
    private meService: MeService,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.userName = AuthService.currentUser.name!;
    this.sidenavAlwaysOpened = window.innerWidth >= 1000;
    window.onresize = () => {
      this.sidenavAlwaysOpened = window.innerWidth >= 1000;
    };
  }

  ngOnInit(): void {
    this.loading = false;

    this.meService
      .getPhotoUrl()
      .subscribe({ next: (photo) => (this.userPhoto = photo) });
  }

  onContentScroll(event: Event) {
    const target = event.target as HTMLElement;
    var st = target.scrollTop;
    if (st > this.lastScrollTop) {
      this.hide = true;
    } else if (st < this.lastScrollTop) {
      this.hide = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  show() {
    this.hide = !this.hide;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  logout() {
    this.dialog
      .open(DialogConfirmationComponent, {
        data: { text: 'Deseja realmente sair do sistema?' },
      })
      .afterClosed()
      .subscribe((logout: boolean) => {
        if (logout) {
          this.auth.logout();
        }
      });
  }

  toggleSidenav() {
    if (this.sidenavAlwaysOpened) return;

    this.sidenavOpened = !this.sidenavOpened;
  }
}
