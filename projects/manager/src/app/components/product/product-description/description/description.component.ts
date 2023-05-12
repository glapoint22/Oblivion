import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent {
  @Input() description!: string;
  @Output() onChange: EventEmitter<string> = new EventEmitter();
  @ViewChild('descriptionContainer') descriptionContainer!: ElementRef<HTMLElement>;

  // ------------------------------------------------------------------------ Ng After View Init ------------------------------------------------------
  ngAfterViewInit() {
    if (this.descriptionContainer) {
      fromEvent(this.descriptionContainer.nativeElement, 'input')
        .pipe(debounceTime(500))
        .subscribe(() => {
          this.onChange.emit(this.descriptionContainer.nativeElement.innerText);
        });
    }
  }
}