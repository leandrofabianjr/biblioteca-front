import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Genre } from '../models/genre';
import { GenresService } from '../services/genres.service';
import { ItemsService } from '../services/items.service';
import { first } from 'rxjs/operators';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { GenresNewComponent } from './genres-new/genres-new.component';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['description'];
  genresSource = new MatTableDataSource<Genre>();
  private genres: Genre[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private gnrSrv: GenresService,
    public dialog: MatDialog,
    private itmSrv: ItemsService
  ) {}

  ngOnInit() {
    this.gnrSrv.data.subscribe((gnrs) => {
      this.genres = gnrs;
      this.genresSource.data = gnrs;
      this.loading = false;
    });
    this.genresSource.paginator = this.paginator ?? null;
    this.genresSource.sort = this.sort ?? null;
  }

  search(column: string, term: string) {
    this.genresSource.data = !term
      ? this.genres
      : this.genres.filter((l) =>
          l.description?.toLowerCase().includes(term.toLowerCase())
        );
  }

  remove(genre: Genre) {
    // this.itmSrv.data.pipe(first()).subscribe((itms) => {
    //   if (
    //     itms.find((i) => i.genres?.find((g) => g.id === genre.id) !== undefined)
    //   ) {
    //     this.dialog.open(DialogInfoComponent, {
    //       data: {
    //         title: 'Desculpe...',
    //         message:
    //           'Não é possível remover este gênero. Há itens relacionados a ele.',
    //       },
    //     });
    //   } else {
    //     this.dialog
    //       .open(DialogConfirmationComponent)
    //       .afterClosed()
    //       .subscribe((res: boolean) => {
    //         if (res) {
    //           this.gnrSrv.delete(genre.id ?? '').subscribe(
    //             (itm) => null,
    //             (err) => console.error('Erro ao remover item')
    //           );
    //         }
    //       });
    //   }
    // });
  }

  edit(genre: Genre) {
    this.dialog.open(GenresNewComponent, { data: genre });
  }
}
