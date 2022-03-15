import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tab-column-search',
  templateUrl: './tab-column-search.component.html',
  styleUrls: ['./tab-column-search.component.scss'],
})
export class TabColumnSearchComponent implements OnInit {
  @Input('header-label') label = '';
  @Input('sort') sort: boolean = false;
  @Input('text') inputText = '';
  @Output('search') search = new EventEmitter<string>();

  displayInput = !!this.inputText;

  constructor() {}

  ngOnInit() {}
}
