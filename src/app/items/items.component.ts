import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import {
  FilterFieldChangeEvent,
  FilterFieldSearchableField,
} from 'app/filter-field/filter-field.component';
import { AlertService } from 'app/services/alert.service';
import { PaginatedData, Pagination } from 'app/services/paginated-data';
import { AuthorsNewComponent } from '../authors/authors-new/authors-new.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { GenresNewComponent } from '../genres/genres-new/genres-new.component';
import { LocationsNewComponent } from '../locations/locations-new/locations-new.component';
import { Author } from '../models/author';
import { Genre } from '../models/genre';
import { Item } from '../models/item';
import { Location } from '../models/location';
import { Publisher } from '../models/publisher';
import { PublishersNewComponent } from '../publishers/publishers-new/publishers-new.component';
import { ItemsService } from '../services/items.service';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  loading = true;
  paginatedData!: PaginatedData<Item>;
  pagination?: Pagination;
  searchableFields: FilterFieldSearchableField[] = [
    { name: 'description', label: 'Descrição' },
    { name: 'authors', label: 'Autor' },
    { name: 'genres', label: 'Gênero' },
    { name: 'year', label: 'Ano' },
    { name: 'publishers', label: 'Editora' },
    { name: 'location', label: 'Local' },
  ];
  sort: Sort = { active: this.searchableFields[0].name, direction: 'asc' };
  searchTerm?: string;
  searchColumn?: string;

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

  search(e: FilterFieldChangeEvent) {
    this.searchTerm = e.term;
    if (e.field) {
      this.searchColumn = e.field;
    }
    this.fetch();
  }

  fetch() {
    console.log(this.searchColumn, this.searchTerm);
    this.loading = true;
    const search = this.searchColumn
      ? { [this.searchColumn]: this.searchTerm }
      : undefined;
    const sort = `${this.sort.direction == 'desc' ? '-' : ''}${
      this.sort.active
    }`;
    this.itmSrv.fetch(this.pagination, search, sort).subscribe(() => undefined);
  }

  changePage(pagination: Pagination) {
    this.pagination = pagination;
    this.fetch();
  }

  editAuthor(author: Author) {
    this.dialog.open(AuthorsNewComponent, { data: author });
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

  sortChange(active: string) {
    this.sort.active = active;
    this.fetch();
  }
}
