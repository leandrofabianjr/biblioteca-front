import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { LogoutComponent } from './logout/logout.component';
import {
  AngularFireAuthGuard,
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { AuthorsComponent } from './authors/authors.component';
import { GenresComponent } from './genres/genres.component';
import { LocationsComponent } from './locations/locations.component';
import { PublishersComponent } from './publishers/publishers.component';
import { ItemsComponent } from './items/items.component';
import { ItemsNewComponent } from './items/items-new/items-new.component';
import { LoggedComponent } from './logged/logged.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  { path: '', redirectTo: 'u/me', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(['u', 'me'])),
  },

  {
    path: 'u',
    component: LoggedComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'me',
        component: UserComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },

      {
        path: 'authors',
        component: AuthorsComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'genres',
        component: GenresComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'locations',
        component: LocationsComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'publishers',
        component: PublishersComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'items',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        children: [
          {
            path: '',
            component: ItemsComponent,
            canActivate: [AngularFireAuthGuard],
            data: { authGuardPipe: redirectUnauthorizedToLogin },
          },
          {
            path: 'new',
            component: ItemsNewComponent,
            canActivate: [AngularFireAuthGuard],
            data: { authGuardPipe: redirectUnauthorizedToLogin },
          },
          {
            path: ':id',
            component: ItemsNewComponent,
            canActivate: [AngularFireAuthGuard],
            data: { authGuardPipe: redirectUnauthorizedToLogin },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
