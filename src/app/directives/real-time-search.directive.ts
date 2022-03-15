import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[appRealTimeSearch]',
})
export class RealTimeSearchDirective implements OnInit {
  @Output('appRealTimeSearch') search: EventEmitter<string> =
    new EventEmitter();
  private subject = new Subject<string>();
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.subject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((v: string) => this.search.emit(v));
  }

  @HostListener('keyup', ['$event.target.value']) onKeyUp(value: any) {
    this.subject.next(value);
  }
}
