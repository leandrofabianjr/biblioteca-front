import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { AuthorsService } from '../../services/authors.service';
import { PublishersService } from '../../services/publishers.service';
import { GenresService } from '../../services/genres.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationsService } from '../../services/locations.service';
import { Author } from '../../models/author';
import { Publisher } from '../../models/publisher';
import { Genre } from '../../models/genre';
import { Location } from '../../models/location';
import { Item } from '../../models/item';
import { AuthorsNewComponent } from '../../authors/authors-new/authors-new.component';
import { PublishersNewComponent } from '../../publishers/publishers-new/publishers-new.component';
import { GenresNewComponent } from '../../genres/genres-new/genres-new.component';
import { LocationsNewComponent } from '../../locations/locations-new/locations-new.component';
import { BookOnlineSearchComponent } from '../../book-online-search/book-online-search.component';
import { GoogleBook } from '../../services/google-books.service';
import { Pagination } from 'app/services/paginated-data';
import { AlertService } from 'app/services/alert.service';

@Component({
  selector: 'app-items-new',
  templateUrl: './items-new.component.html',
  styleUrls: ['./items-new.component.scss'],
})
export class ItemsNewComponent implements OnInit {
  itemUuid!: string;
  itemForm!: FormGroup;
  authors!: Author[];
  publishers!: Publisher[];
  genres!: Genre[];
  locations!: Location[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itmSrv: ItemsService,
    private autSrv: AuthorsService,
    private pubSrv: PublishersService,
    private gnrSrv: GenresService,
    private locSrv: LocationsService,
    private alert: AlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        return this.buildForm();
      }

      this.itmSrv.get(id).subscribe({
        next: (itm) => {
          this.itemUuid = id;
          this.buildForm(itm);
        },
        error: () => {
          this.buildForm();
          // TODO: Mostrar 404
        },
      });
    });
  }

  private buildForm(item?: Item) {
    this.itemForm = this.fb.group({
      description: [item?.description, Validators.required],
      authors: [item?.authors, Validators.required],
      publishers: [item?.publishers, Validators.required],
      year: [item?.year, [Validators.required, Validators.pattern('[0-9]*')]],
      genres: [item?.genres, Validators.required],
      location: [item?.location, Validators.required],
    });
  }

  save() {
    console.log('save');
    if (this.itemForm?.valid) {
      const item = new Item();
      item.uuid = this.itemUuid;
      item.description = this.itemForm.get('description')?.value;
      item.authors = this.itemForm.get('authors')?.value;
      item.genres = this.itemForm.get('genres')?.value;
      item.publishers = this.itemForm.get('publishers')?.value;
      item.location = this.itemForm.get('location')?.value;
      item.year = this.itemForm.get('year')?.value;
      console.log(item);
      this.itmSrv.save(item).subscribe({
        next: (itm) => {
          this.alert.success('Item salvo com sucesso.');
          this.itemForm?.reset();
          this.router.navigate(['u', 'items', 'new']);
        },
        error: (err) => {
          console.error('Erro ao salvar item', err);
          this.alert.error(`Ops, o item não pôde ser cadastrado.`);
        },
      });
    }
  }

  newResource(type: 'publishers' | 'authors' | 'genres' | 'location') {
    let dialogRef;
    switch (type) {
      case 'publishers':
        dialogRef = this.dialog.open(PublishersNewComponent);
        break;
      case 'authors':
        dialogRef = this.dialog.open(AuthorsNewComponent);
        break;
      case 'genres':
        dialogRef = this.dialog.open(GenresNewComponent);
        break;
      default:
        dialogRef = this.dialog.open(LocationsNewComponent);
        break;
    }

    dialogRef.afterClosed().subscribe((obj) => {
      if (!obj) return;

      const value =
        type == 'location'
          ? obj
          : (this.itemForm.get(type)?.value || []).concat(obj);

      this.itemForm?.get(type)?.setValue(value);
    });
  }

  searchAuthors(name: string) {
    this.autSrv.fetch(new Pagination(), { name }).subscribe({
      next: (objs) => (this.authors = objs),
      error: (err) => {
        console.error(err), this.alert.error(`Não foi possível buscar`);
      },
    });
  }

  searchPublishers(name: string) {
    this.pubSrv.fetch(new Pagination(), { name }).subscribe({
      next: (objs) => (this.publishers = objs),
      error: (err) => {
        console.error(err), this.alert.error(`Não foi possível buscar`);
      },
    });
  }

  searchGenres(description: string) {
    this.gnrSrv.fetch(new Pagination(), { description }).subscribe({
      next: (objs) => (this.genres = objs),
      error: (err) => {
        console.error(err), this.alert.error(`Não foi possível buscar`);
      },
    });
  }

  searchLocations(description: string) {
    this.locSrv.fetch(new Pagination(), { description }).subscribe({
      next: (objs) => (this.locations = objs),
      error: (err) => {
        console.error(err), this.alert.error(`Não foi possível buscar`);
      },
    });
  }

  onlineSearch() {
    const dialogRef = this.dialog.open(BookOnlineSearchComponent, {
      minWidth: '80vw',
    });

    dialogRef.afterClosed().subscribe((result: GoogleBook) => {
      if (result) {
        console.log(result);
      }
    });
  }
}
