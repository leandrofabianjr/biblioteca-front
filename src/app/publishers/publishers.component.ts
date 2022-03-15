import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Publisher } from '../models/publisher';
import { PublishersService } from '../services/publishers.service';
import { ItemsService } from '../services/items.service';
import { first } from 'rxjs/operators';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { PublishersNewComponent } from '../publishers/publishers-new/publishers-new.component';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss'],
})
export class PublishersComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['name'];
  publishersSource = new MatTableDataSource<Publisher>();
  private publishers: Publisher[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private pubSrv: PublishersService,
    public dialog: MatDialog,
    private itmSrv: ItemsService
  ) {}

  ngOnInit() {
    this.pubSrv.data.subscribe((pubs) => {
      this.publishers = pubs;
      this.publishersSource.data = pubs;
      this.loading = false;
    });
    this.publishersSource.paginator = this.paginator ?? null;
    this.publishersSource.sort = this.sort ?? null;
  }

  search(column: string, term: string) {
    this.publishersSource.data = !term
      ? this.publishers
      : this.publishers.filter((l) =>
          l.name?.toLowerCase().includes(term.toLowerCase())
        );
  }

  remove(publisher: Publisher) {
    this.itmSrv.data.pipe(first()).subscribe((itms) => {
      if (
        itms.find(
          (i) => i.publishers?.find((a) => a.id === publisher.id) !== undefined
        )
      ) {
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Desculpe...',
            message:
              'Não é possível remover esta editora. Há itens relacionados a ela.',
          },
        });
      } else {
        this.dialog
          .open(DialogConfirmationComponent)
          .afterClosed()
          .subscribe((res: boolean) => {
            if (res) {
              this.pubSrv.delete(publisher.id as '').subscribe(
                (itm) => null,
                (err) => console.error('Erro ao remover item')
              );
            }
          });
      }
    });
  }

  edit(publisher: Publisher) {
    this.dialog.open(PublishersNewComponent, { data: publisher });
  }
}
