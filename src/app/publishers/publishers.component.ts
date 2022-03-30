import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/dialog-confirmation/dialog-confirmation.component';
import { AlertService } from 'app/services/alert.service';
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
  searchQuery = {};

  constructor(
    private pubSrv: PublishersService,
    public dialog: MatDialog,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.pubSrv.data.subscribe((data) => {
      this.paginatedData = data;
      this.loading = false;
    });
    this.fetch();
  }

  fetch(pagination?: Pagination) {
    this.pubSrv.fetch(pagination, this.searchQuery).subscribe(() => undefined);
  }

  search(column: string, term: string) {
    this.searchQuery = { ...this.searchQuery, [column]: term };
    this.fetch();
  }

  remove(publisher: Publisher) {
    this.dialog
      .open(DialogConfirmationComponent)
      .afterClosed()
      .subscribe((toRemove: boolean) => {
        if (toRemove) {
          this.pubSrv.remove(publisher).subscribe({
            next: () => {
              this.alert.success('Removida com sucesso.');
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

  edit(publisher: Publisher) {
    this.dialog
      .open(PublishersNewComponent, { data: publisher })
      .afterClosed()
      .subscribe(() => this.fetch());
  }

  new() {
    const dialogRef = this.dialog
      .open(PublishersNewComponent)
      .afterClosed()
      .subscribe((pub) => {
        if (pub) {
          this.alert.success('Editora criada com sucesso');
          this.fetch();
        }
      });
  }
}
