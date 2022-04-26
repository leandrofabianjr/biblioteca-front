import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFieldInputComponent } from './filter-field-input.component';

describe('FilterFieldInputComponent', () => {
  let component: FilterFieldInputComponent;
  let fixture: ComponentFixture<FilterFieldInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterFieldInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
