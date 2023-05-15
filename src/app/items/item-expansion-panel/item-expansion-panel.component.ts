import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterFieldChangeEvent } from 'app/filter-field/filter-field.component';
import { Item } from 'app/models/item';

@Component({
  selector: 'app-item-expansion-panel',
  templateUrl: './item-expansion-panel.component.html',
  styleUrls: ['./item-expansion-panel.component.scss'],
})
export class ItemExpansionPanelComponent implements OnInit {
  @Input() data?: Item[];
  @Output() selectToSearch = new EventEmitter<FilterFieldChangeEvent>();

  constructor() {}

  ngOnInit(): void {}

  search(field: string, term: string) {
    this.selectToSearch.emit({ field, term });
  }
}
