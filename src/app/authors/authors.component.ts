import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/dialog-confirmation/dialog-confirmation.component';
import { AlertService } from 'app/services/alert.service';
import { PaginatedData, Pagination } from 'app/services/paginated-data';
import { Author } from '../models/author';
import { AuthorsNewComponent } from '../authors/authors-new/authors-new.component';
import { AuthorsService } from '../services/authors.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['name'];
  paginatedData!: PaginatedData<Author>;
  searchQuery = {};

  constructor(
    private autSrv: AuthorsService,
    public dialog: MatDialog,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.autSrv.data.subscribe((data) => {
      this.paginatedData = data;
      this.loading = false;
    });
    this.fetch();
  }

  fetch(pagination?: Pagination) {
    this.autSrv.fetch(pagination, this.searchQuery).subscribe(() => undefined);
  }

  search(column: string, term: string) {
    this.searchQuery = { ...this.searchQuery, [column]: term };
    this.fetch();
  }

  remove(author: Author) {
    this.dialog
      .open(DialogConfirmationComponent)
      .afterClosed()
      .subscribe((toRemove: boolean) => {
        if (toRemove) {
          this.autSrv.remove(author).subscribe({
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

  edit(author: Author) {
    this.dialog
      .open(AuthorsNewComponent, { data: author })
      .afterClosed()
      .subscribe(() => this.fetch());
  }

  new() {
    const dialogRef = this.dialog
      .open(AuthorsNewComponent)
      .afterClosed()
      .subscribe((aut) => {
        if (aut) {
          this.alert.success('Autor criado com sucesso');
          this.fetch();
        }
      });
  }
}
