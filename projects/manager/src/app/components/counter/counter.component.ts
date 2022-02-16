import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  @Input() itemCount!: number;
  @Input() currentIndex: number = 0;
  @Output() onItemChange: EventEmitter<number> = new EventEmitter();

  onArrowClick(direction: number) {
    if (this.itemCount == 0) return;

    this.currentIndex = Math.min(Math.max(0, this.currentIndex + direction), this.itemCount - 1);
    this.onItemChange.emit(this.currentIndex);
  }

  set(number: number) {
    this.currentIndex = number - 1;
  }
}
