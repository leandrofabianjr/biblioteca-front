import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/dialog-confirmation/dialog-confirmation.component';
import { AlertService } from 'app/services/alert.service';
import { PaginatedData, Pagination } from 'app/services/paginated-data';
import { Location } from '../models/location';
import { LocationsService } from '../services/locations.service';
import { LocationsNewComponent } from './locations-new/locations-new.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['description'];
  paginatedData!: PaginatedData<Location>;

  constructor(
    private locSrv: LocationsService,
    public dialog: MatDialog,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.locSrv.data.subscribe((data) => {
      this.paginatedData = data;
      this.loading = false;
    });
    this.fetch();
  }

  fetch(pagination?: Pagination) {
    console.log(pagination);
    this.locSrv.fetch(pagination).subscribe(() => console.log('foi'));
  }

  search(column: string, term: string) {
    // TODO
  }

  remove(location: Location) {
    this.dialog
      .open(DialogConfirmationComponent)
      .afterClosed()
      .subscribe((toRemove: boolean) => {
        if (toRemove) {
          this.locSrv.remove(location).subscribe({
            next: () => {
              this.alert.success('Removido com sucesso.');
              this.fetch();
            },
            error: (err) => {
              console.error('Erro ao remover.', err);
              const msg = err?.error?.message;
              this.alert.error(`Não foi possível remover. ${msg}`);
              this.loading = false;
            },
          });
        }
      });
  }

  edit(location: Location) {
    this.dialog
      .open(LocationsNewComponent, { data: location })
      .afterClosed()
      .subscribe(() => this.fetch());
  }

  new() {
    this.dialog
      .open(LocationsNewComponent)
      .afterClosed()
      .subscribe((loc) => {
        if (loc) {
          this.alert.success('Local criado com sucesso');
          this.fetch();
        }
      });
  }
}
