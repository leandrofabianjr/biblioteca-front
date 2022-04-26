import { A11yModule } from '@angular/cdk/a11y';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorsNewComponent } from './authors/authors-new/authors-new.component';
import { AuthorsComponent } from './authors/authors.component';
// import { AdsenseModule } from 'ng2-adsense';
import { BookOnlineSearchComponent } from './book-online-search/book-online-search.component';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { RealTimeSearchDirective } from './directives/real-time-search.directive';
import { GenresNewComponent } from './genres/genres-new/genres-new.component';
import { GenresComponent } from './genres/genres.component';
import { InfoErroCampoComponent } from './info-erro-campo/info-erro-campo.component';
import { ItemsNewComponent } from './items/items-new/items-new.component';
import { ItemsComponent } from './items/items.component';
import { LocationsNewComponent } from './locations/locations-new/locations-new.component';
import { LocationsComponent } from './locations/locations.component';
import { LoggedComponent } from './logged/logged.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MatPaginatorIntlPtbr } from './mat-paginator-intl-ptbr';
import { PaginatorComponent } from './paginator/paginator.component';
import { PublishersNewComponent } from './publishers/publishers-new/publishers-new.component';
import { PublishersComponent } from './publishers/publishers.component';
import { TabColumnSearchComponent } from './tab-column-search/tab-column-search.component';
import { UserComponent } from './user/user.component';
import { FilterFieldComponent } from './filter-field/filter-field.component';
import { FilterFieldInputComponent } from './filter-field/filter-field-input/filter-field-input.component';
import { ItemExpansionPanelComponent } from './items/item-expansion-panel/item-expansion-panel.component';

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
    FilterFieldComponent,
    FilterFieldInputComponent,
    ItemExpansionPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    MatExpansionModule,
    ReactiveFormsModule,
    NgSelectModule,
    A11yModule,
    HttpClientModule,
    // AdsenseModule.forRoot({
    //   adClient: 'ca-pub-3580088567894548',
    //   adSlot: 7259870550,
    // }),
    FormsModule,
    FlexLayoutModule,
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
