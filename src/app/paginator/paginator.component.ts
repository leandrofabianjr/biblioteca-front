import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  PAGE_SIZE_OPTIONS,
  PaginatedData,
  Pagination,
} from 'app/services/paginated-data';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.sass'],
})
export class PaginatorComponent implements OnInit {
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  @Input() paginatedData = new PaginatedData();

  @Output() change: EventEmitter<Pagination> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  changePage({ pageIndex: page, pageSize }: PageEvent) {
    console.log('chamou');
    this.change.emit(new Pagination(page, pageSize));
  }
}
