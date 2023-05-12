import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsComponent } from './authors/authors.component';
import { GenresComponent } from './genres/genres.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { HomeComponent } from './home/home.component';
import { ItemsNewComponent } from './items/items-new/items-new.component';
import { ItemsComponent } from './items/items.component';
import { LocationsComponent } from './locations/locations.component';
import { LoggedComponent } from './logged/logged.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PublishersComponent } from './publishers/publishers.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'u/home', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard],
  },

  {
    path: 'u',
    component: LoggedComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'me',
        component: UserComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'authors',
        component: AuthorsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'genres',
        component: GenresComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'locations',
        component: LocationsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'publishers',
        component: PublishersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'items',
        canActivate: [AuthGuard],

        children: [
          {
            path: '',
            component: ItemsComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'new',
            component: ItemsNewComponent,
            canActivate: [AuthGuard],
          },
          {
            path: ':id',
            component: ItemsNewComponent,
            canActivate: [AuthGuard],
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
