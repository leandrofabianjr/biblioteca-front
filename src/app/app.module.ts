import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { LogoutComponent } from './logout/logout.component';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { AuthorsComponent } from './authors/authors.component';
import { GenresComponent } from './genres/genres.component';
import { LocationsComponent } from './locations/locations.component';
import { PublishersComponent } from './publishers/publishers.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemsComponent } from './items/items.component';
import { MatPaginatorIntlPtbr } from './mat-paginator-intl-ptbr';
import { ItemsNewComponent } from './items/items-new/items-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoErroCampoComponent } from './info-erro-campo/info-erro-campo.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RealTimeSearchDirective } from './directives/real-time-search.directive';
import { AuthorsNewComponent } from './authors/authors-new/authors-new.component';
import { GenresNewComponent } from './genres/genres-new/genres-new.component';
import { LocationsNewComponent } from './locations/locations-new/locations-new.component';
import { PublishersNewComponent } from './publishers/publishers-new/publishers-new.component';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';
import { TabColumnSearchComponent } from './tab-column-search/tab-column-search.component';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { A11yModule } from '@angular/cdk/a11y';
// import { AdsenseModule } from 'ng2-adsense';
import { BookOnlineSearchComponent } from './book-online-search/book-online-search.component';
import { HttpClientModule } from '@angular/common/http';
import { LoggedComponent } from './logged/logged.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularFireModule } from '@angular/fire/compat';
import { PaginatorComponent } from './paginator/paginator.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    LogoutComponent,
    AuthorsComponent,
    GenresComponent,
    LocationsComponent,
    PublishersComponent,
    ItemsComponent,
    ItemsNewComponent,
    InfoErroCampoComponent,
    RealTimeSearchDirective,
    AuthorsNewComponent,
    GenresNewComponent,
    LocationsNewComponent,
    PublishersNewComponent,
    DialogConfirmationComponent,
    TabColumnSearchComponent,
    LoggedComponent,
    DialogInfoComponent,
    BookOnlineSearchComponent,
    PaginatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgSelectModule,
    A11yModule,
    HttpClientModule,
    // AdsenseModule.forRoot({
    //   adClient: 'ca-pub-3580088567894548',
    //   adSlot: 7259870550,
    // }),
    FormsModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlPtbr,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AuthorsNewComponent,
    GenresNewComponent,
    PublishersNewComponent,
    LocationsNewComponent,
    DialogConfirmationComponent,
    DialogInfoComponent,
    BookOnlineSearchComponent,
  ],
})
export class AppModule {}
