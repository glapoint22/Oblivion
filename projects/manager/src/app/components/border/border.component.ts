import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Border } from 'widgets';

@Component({
  selector: 'border',
  templateUrl: './border.component.html',
  styleUrls: ['./border.component.scss']
})
export class BorderComponent {
  @Input() border!: Border;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
}