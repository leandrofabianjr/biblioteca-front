import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type FilterFieldSearchableField = {
  label: string;
  name: string;
};

export type FilterFieldChangeEvent = {
  field: string;
  term: string;
};

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.scss'],
})
export class FilterFieldComponent implements OnInit {
  @Input() searchableFields: FilterFieldSearchableField[] = [];
  @Input() selectedField?: string;
  @Input() term?: string;
  @Output() searchChange = new EventEmitter<FilterFieldChangeEvent>();

  isMouseOver = false;

  constructor() {}

  ngOnInit() {
    if (!this.searchableFields?.length) {
      throw new Error('searchableFields deve ser informado');
    }
    if (!this.selectedField) {
      this.selectedField = this.searchableFields[0].name;
    }
  }

  onChange() {
    const event: FilterFieldChangeEvent = {
      field: this.selectedField!,
      term: this.term!,
    };
    console.log(event);
    this.searchChange.emit(event);
  }

  onFieldChange(field: string) {
    this.selectedField = field;
    this.onChange();
  }

  onTermChange(term: string) {
    this.term = term;
    this.onChange();
  }
}
