import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  GoogleApiResponse,
  GoogleBook,
  GoogleBooksService,
} from '../services/google-books.service';

@Component({
  selector: 'app-book-online-search',
  templateUrl: './book-online-search.component.html',
  styleUrls: ['./book-online-search.component.scss'],
})
export class BookOnlineSearchComponent implements OnInit {
  booksResponse?: GoogleApiResponse<GoogleBook>;

  constructor(
    public dialogRef: MatDialogRef<BookOnlineSearchComponent>,
    private googleBooks: GoogleBooksService
  ) {}

  ngOnInit() {}

  search(query: string) {
    this.googleBooks
      .search(query)
      .subscribe((res) => (this.booksResponse = res));
  }

  useItem(book: GoogleBook) {
    this.dialogRef.close(book);
  }
}
