import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationsService } from '../services/locations.service';
import { Location } from '../models/location';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { ItemsService } from '../services/items.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { first } from 'rxjs/operators';
import { LocationsNewComponent } from './locations-new/locations-new.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['description'];
  locationsSource = new MatTableDataSource<Location>();
  private locations?: Location[];

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private locSrv: LocationsService,
    public dialog: MatDialog,
    private itmSrv: ItemsService
  ) {}

  ngOnInit() {
    this.locSrv.data.subscribe((locs) => {
      this.locations = locs;
      this.locationsSource.data = locs;
      this.loading = false;
    });
    this.locationsSource.paginator = this.paginator ?? null;
    this.locationsSource.sort = this.sort ?? null;
  }

  search(column: string, term: string) {
    this.locationsSource.data =
      (!term
        ? this.locations
        : this.locations?.filter((l) =>
            l.description?.toLowerCase().includes(term.toLowerCase())
          )) ?? [];
  }

  remove(location: Location) {
    this.itmSrv.data.pipe(first()).subscribe((itms) => {
      if (itms.find((i) => i.location?.id === location.id)) {
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Desculpe...',
            message:
              'Não é possível remover este local. Há itens relacionados a ele.',
          },
        });
      } else {
        this.dialog
          .open(DialogConfirmationComponent)
          .afterClosed()
          .subscribe((res: boolean) => {
            if (res) {
              this.locSrv.delete(location.id ?? '').subscribe(
                (itm) => null,
                (err) => console.error('Erro ao remover item')
              );
            }
          });
      }
    });
  }

  edit(location: Location) {
    this.dialog.open(LocationsNewComponent, { data: location });
  }
}
