import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthorsService } from '../services/authors.service';
import { Author } from '../models/author';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ItemsService } from '../services/items.service';
import { first } from 'rxjs/operators';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { AuthorsNewComponent } from './authors-new/authors-new.component';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['name'];
  authorsSource = new MatTableDataSource<Author>();
  private authors: Author[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private autSrv: AuthorsService,
    public dialog: MatDialog,
    private itmSrv: ItemsService
  ) {}

  ngOnInit() {
    this.autSrv.data.subscribe((auts) => {
      this.authors = auts;
      this.authorsSource.data = auts;
      this.loading = false;
    });
    this.authorsSource.paginator = this.paginator ?? null;
    this.authorsSource.sort = this.sort ?? null;
  }

  search(column: string, term: string) {
    this.authorsSource.data = !term
      ? this.authors
      : this.authors.filter((l) =>
          l.name?.toLowerCase().includes(term.toLowerCase())
        );
  }

  remove(author: Author) {
    this.itmSrv.data.pipe(first()).subscribe((itms) => {
      if (
        itms.find(
          (i) => i.authors?.find((a) => a.id === author.id) !== undefined
        )
      ) {
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Desculpe...',
            message:
              'Não é possível remover este autor. Há itens relacionados a ele.',
          },
        });
      } else {
        this.dialog
          .open(DialogConfirmationComponent)
          .afterClosed()
          .subscribe((res: boolean) => {
            if (res) {
              this.autSrv.delete(author.id ?? '').subscribe(
                (itm) => null,
                (err) => console.error('Erro ao remover item')
              );
            }
          });
      }
    });
  }

  edit(author: Author) {
    this.dialog.open(AuthorsNewComponent, { data: author });
  }
}
