import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-field-input',
  templateUrl: './filter-field-input.component.html',
  styleUrls: ['./filter-field-input.component.sass'],
})
export class FilterFieldInputComponent implements OnInit {
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();

  isMouseOver = false;

  constructor() {}

  ngOnInit() {}

  termChange(term?: string) {
    this.value = term;
    this.valueChange.emit(this.value);
  }

  clean() {
    this.termChange();
  }
}
