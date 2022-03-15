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

@Component({
  selector: 'app-items-new',
  templateUrl: './items-new.component.html',
  styleUrls: ['./items-new.component.scss'],
})
export class ItemsNewComponent {
  itemId!: string;
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
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        const itm = this.itmSrv.get(id);
        if (itm) {
          this.itemId = id;
          this.buildForm(itm);
        } else {
          // Mostrar mensagem
        }
      } else {
        this.buildForm();
      }
    });
  }

  private buildForm(item?: Item) {
    this.itemForm = this.fb.group({
      description: [item ? item.description : null, Validators.required],
      authors: [item ? item.authors : null, Validators.required],
      publishers: [item ? item.publishers : null, Validators.required],
      year: [
        item ? item.year : null,
        [Validators.required, Validators.pattern('[0-9]*')],
      ],
      genres: [item ? item.genres : null, Validators.required],
      location: [item ? item.location : null, Validators.required],
    });
  }

  save() {
    console.log('save');
    if (this.itemForm?.valid) {
      const item = new Item();
      item.id = this.itemId;
      item.description = this.itemForm.get('description')?.value;
      item.authors = this.itemForm.get('authors')?.value;
      item.genres = this.itemForm.get('genres')?.value;
      item.publishers = this.itemForm.get('publishers')?.value;
      item.location = this.itemForm.get('location')?.value;
      item.year = this.itemForm.get('year')?.value;

      this.itmSrv.save(item).subscribe(
        (itm) => {
          this.snackBar.open('Item salvo com sucesso!', 'Ok', {
            duration: 3000,
          });

          this.itemForm?.reset();
          this.router.navigate(['u', 'items', 'new']);
        },
        (err) => {
          console.error('Erro ao salvar item', err);
          this.snackBar.open('Ops, o item não pode ser cadastrado :(', 'Ok', {
            duration: 3000,
          });
        }
      );
    }
  }

  newAuthor() {
    const dialogRef = this.dialog.open(AuthorsNewComponent);

    dialogRef.afterClosed().subscribe((result: Author) => {
      if (result) {
        this.itemForm
          ?.get('authors')
          ?.setValue(
            (this.itemForm?.get('authors')?.value || []).concat(result)
          );
      }
    });
  }

  newPublisher() {
    const dialogRef = this.dialog.open(PublishersNewComponent);

    dialogRef.afterClosed().subscribe((result: Publisher) => {
      if (result) {
        this.itemForm
          ?.get('publishers')
          ?.setValue(
            (this.itemForm.get('publishers')?.value || []).concat(result)
          );
      }
    });
  }

  newGenre() {
    const dialogRef = this.dialog.open(GenresNewComponent);

    dialogRef.afterClosed().subscribe((result: Genre) => {
      if (result) {
        this.itemForm
          ?.get('genres')
          ?.setValue((this.itemForm.get('genres')?.value || []).concat(result));
      }
    });
  }

  newLocation() {
    const dialogRef = this.dialog.open(LocationsNewComponent);

    dialogRef.afterClosed().subscribe((result: Location) => {
      if (result) {
        this.itemForm?.get('location')?.setValue(result);
      }
    });
  }

  searchAuthors(term: string) {
    this.autSrv.data.subscribe(
      (auts) =>
        (this.authors = auts.filter((a) =>
          a.name?.toLowerCase().includes(term.toLowerCase())
        )),
      (err) => console.error(err)
    );
  }

  searchPublishers(term: string) {
    this.pubSrv.data.subscribe(
      (edts) =>
        (this.publishers = edts.filter((p) =>
          p.name?.toLowerCase().includes(term.toLowerCase())
        )),
      (err) => console.error(err)
    );
  }

  searchGenres(term: string) {
    this.gnrSrv.data.subscribe(
      (gens) =>
        (this.genres = gens.filter((g) =>
          g.description?.toLowerCase().includes(term.toLowerCase())
        )),
      (err) => console.error(err)
    );
  }

  searchLocations(term: string) {
    this.locSrv.data.subscribe(
      (locs) =>
        (this.locations = locs
          .filter((l) =>
            l.description?.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 4)),
      (err) => console.error(err)
    );
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
