import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public auth: AuthService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
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

  ngOnInit(): void {
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  logout() {
    this.auth.logout();
  }
}
