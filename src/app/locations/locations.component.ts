import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private locSrv: LocationsService, public dialog: MatDialog) {}

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
    // this.itmSrv.data.pipe(first()).subscribe((itms) => {
    //   if (itms.find((i) => i.location?.uuid === location.uuid)) {
    //     this.dialog.open(DialogInfoComponent, {
    //       data: {
    //         title: 'Desculpe...',
    //         message:
    //           'Não é possível remover este local. Há itens relacionados a ele.',
    //       },
    //     });
    //   } else {
    //     this.dialog
    //       .open(DialogConfirmationComponent)
    //       .afterClosed()
    //       .subscribe((res: boolean) => {
    //         if (res) {
    //           // this.locSrv.delete(location.id ?? '').subscribe(
    //           //   (itm) => null,
    //           //   (err) => console.error('Erro ao remover item')
    //           // );
    //         }
    //       });
    //   }
    // });
  }

  edit(location: Location) {
    this.dialog.open(LocationsNewComponent, { data: location });
  }

  newLocation() {
    const dialogRef = this.dialog.open(LocationsNewComponent);

    dialogRef.afterClosed().subscribe(() => this.fetch());
  }
}
