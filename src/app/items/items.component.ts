import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from '../services/items.service';
import { Item } from '../models/item';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { AuthService } from '../services/auth.service';

const PAGINATOR_SIZE_OPTIONS = [5, 10, 100];

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = [
    'description',
    'authors',
    'genres',
    'year',
    'publishers',
    'location',
  ];
  searchTerms: { [key: string]: string } = {};
  itemsSource = new MatTableDataSource<Item>();
  readonly pageSizeOptions = PAGINATOR_SIZE_OPTIONS;
  total = 0;
  pageSize = this.pageSizeOptions[0];
  pageIndex = 0;
  private items: Item[] = [];

  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatSort, { static: true }) matSort!: MatSort;

  constructor(
    private itmSrv: ItemsService,
    public dialog: MatDialog,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // this.itemsSource.paginator = this.paginator;
    // this.itemsSource.sort = this.matSort;

    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.auth.currentUser.subscribe((user) => {
      if (!user) return;
      this.itmSrv
        .fetchForTable(
          user.uuid,
          this.pageSize,
          this.pageIndex,
          this.searchTerms
        )
        .subscribe((res) => {
          console.log(res);
          this.items = res.data;
          this.itemsSource.data = this.items;
          this.total = res.total;
          this.loading = false;
        });
    });
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
    const dialogRef = this.dialog.open(DialogConfirmationComponent);

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        // this.itmSrv.delete(item.id ?? '').subscribe(
        //   (itm) => null,
        //   (err) => console.error('Erro ao remover item')
        // );
      }
    });
  }

  search(column: string, term: string) {
    this.searchTerms[column] = `%${term}%`;
    this.pageIndex = 0;
    this.pageSize = this.pageSizeOptions[0];

    this.fetchData();

    // let filteredItems = this.items?.slice();
    // this.searchTerms.map((t, i) => {
    //   if (t) {
    //     t = t.toLowerCase();
    //     switch (this.displayedColumns[i]) {
    //       case 'description':
    //         filteredItems = filteredItems?.filter((itm) =>
    //           itm.description?.toLowerCase().includes(t)
    //         );
    //         break;
    //       case 'authors':
    //         filteredItems = filteredItems?.filter((itm) =>
    //           itm.authors?.find((a) => a.name?.toLowerCase().includes(t))
    //         );
    //         break;
    //       case 'genres':
    //         filteredItems = filteredItems?.filter((itm) =>
    //           itm.genres?.find((g) => g.description?.toLowerCase().includes(t))
    //         );
    //         break;
    //       case 'year':
    //         filteredItems = filteredItems?.filter((itm) =>
    //           itm.year?.toString().includes(t)
    //         );
    //         break;
    //       case 'publishers':
    //         filteredItems = filteredItems?.filter((itm) =>
    //           itm.publishers?.find((p) => p.name?.toLowerCase().includes(t))
    //         );
    //         break;
    //       case 'location':
    //         filteredItems = filteredItems?.filter((itm) =>
    //           itm.location?.description?.toLowerCase().includes(t)
    //         );
    //         break;
    //     }
    //   }
    // });
    // this.itemsSource.data = filteredItems ?? [];
  }

  sort(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.itemsSource.data = this.items ?? [];
      return;
    }
    const sortFn = (a: any, b: any) =>
      (a < b ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    switch (sort.active) {
      case 'description':
        this.items?.sort((a, b) => sortFn(a.description, b.description));
        break;
      case 'year':
        this.items?.sort((a, b) => sortFn(a.year, b.year));
        break;
      case 'location':
        this.items?.sort((a, b) =>
          sortFn(a.location?.description, b.location?.description)
        );
        break;
      default:
        return;
    }
  }

  onPageChange(e: PageEvent) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchData();
  }
}
