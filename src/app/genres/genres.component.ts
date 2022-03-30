import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'app/services/alert.service';
import { PaginatedData, Pagination } from 'app/services/paginated-data';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Genre } from '../models/genre';
import { GenresService } from '../services/genres.service';
import { GenresNewComponent } from './genres-new/genres-new.component';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['description'];
  paginatedData!: PaginatedData<Genre>;
  searchQuery = {};

  constructor(
    private gnrSrv: GenresService,
    public dialog: MatDialog,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.gnrSrv.data.subscribe((data) => {
      this.paginatedData = data;
      this.loading = false;
    });
    this.fetch();
  }

  fetch(pagination?: Pagination) {
    this.gnrSrv.fetch(pagination, this.searchQuery).subscribe(() => undefined);
  }

  search(column: string, term: string) {
    this.searchQuery = { ...this.searchQuery, [column]: term };
    this.fetch();
  }

  remove(genre: Genre) {
    this.dialog
      .open(DialogConfirmationComponent)
      .afterClosed()
      .subscribe((toRemove: boolean) => {
        if (toRemove) {
          this.gnrSrv.remove(genre).subscribe({
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

  edit(genre: Genre) {
    this.dialog
      .open(GenresNewComponent, { data: genre })
      .afterClosed()
      .subscribe(() => this.fetch());
  }

  new() {
    this.dialog
      .open(GenresNewComponent)
      .afterClosed()
      .subscribe((gnr) => {
        if (gnr) {
          this.alert.success('Local criado com sucesso');
          this.fetch();
        }
      });
  }
}
