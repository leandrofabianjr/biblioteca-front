import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from '../services/items.service';
import { Item } from '../models/item';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Author } from '../models/author';
import { AuthorsNewComponent } from '../authors/authors-new/authors-new.component';
import { Genre } from '../models/genre';
import { GenresNewComponent } from '../genres/genres-new/genres-new.component';
import { Location } from '../models/location';
import { LocationsNewComponent } from '../locations/locations-new/locations-new.component';
import { Publisher } from '../models/publisher';
import { PublishersNewComponent } from '../publishers/publishers-new/publishers-new.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { PaginatedData, Pagination } from 'app/services/paginated-data';
import { AlertService } from 'app/services/alert.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  loading = true;
  displayedColumns = [
    'description',
    'authors',
    'genres',
    'year',
    'publishers',
    'location',
  ];
  paginatedData!: PaginatedData<Author>;
  searchQuery: any = {};
  sortQuery?: string;
  pagination?: Pagination;

  constructor(
    private itmSrv: ItemsService,
    public dialog: MatDialog,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.itmSrv.data.subscribe((data) => {
      this.paginatedData = data;
      this.loading = false;
    });
    this.fetch();
  }

  fetch() {
    this.itmSrv
      .fetch(this.pagination, this.searchQuery, this.sortQuery)
      .subscribe(() => undefined);
  }

  changePage(pagination: Pagination) {
    this.pagination = pagination;
    this.fetch();
  }

  getSearchQuery(column: string): string {
    return this.searchQuery?.[column] ?? '';
  }

  editAuthor(author: Author) {
    this.dialog.open(AuthorsNewComponent, { data: author });
  }

  search(column: string, term: string) {
    this.searchQuery = { ...this.searchQuery, [column]: term };
    this.fetch();
  }

  editGenre(genre: Genre) {
    this.dialog.open(GenresNewComponent, { data: genre });
  }

  editPublisher(publisher: Publisher) {
    this.dialog.open(PublishersNewComponent, { data: publisher });
  }

  editLocation(location: Location) {
    this.dialog.open(LocationsNewComponent, { data: location });
  }

  remove(item: Item) {
    this.dialog
      .open(DialogConfirmationComponent)
      .afterClosed()
      .subscribe((toRemove: boolean) => {
        if (toRemove) {
          this.itmSrv.remove(item).subscribe({
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

  sort(sort: Sort) {
    this.sortQuery = `${sort.direction == 'desc' ? '-' : ''}${sort.active}`;
    this.fetch();
  }
}
