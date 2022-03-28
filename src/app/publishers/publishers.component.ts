import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginatedData, Pagination } from 'app/services/paginated-data';
import { Publisher } from '../models/publisher';
import { PublishersNewComponent } from '../publishers/publishers-new/publishers-new.component';
import { PublishersService } from '../services/publishers.service';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss'],
})
export class PublishersComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['name'];
  paginatedData!: PaginatedData<Publisher>;

  constructor(private pubSrv: PublishersService, public dialog: MatDialog) {}

  ngOnInit() {
    this.pubSrv.data.subscribe((data) => {
      this.paginatedData = data;
      this.loading = false;
    });
    this.fetch();
  }

  fetch(pagination?: Pagination) {
    console.log(pagination);
    this.pubSrv.fetch(pagination).subscribe(() => console.log('foi'));
  }

  search(column: string, term: string) {
    // TODO
  }

  remove(publisher: Publisher) {
    // TODO
  }

  edit(publisher: Publisher) {
    this.dialog.open(PublishersNewComponent, { data: publisher });
  }

  new() {
    const dialogRef = this.dialog.open(PublishersNewComponent);

    dialogRef.afterClosed().subscribe(() => this.fetch());
  }
}
