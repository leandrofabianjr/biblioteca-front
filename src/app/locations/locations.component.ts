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
    // TODO
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
      .subscribe(() => this.fetch());
  }
}
