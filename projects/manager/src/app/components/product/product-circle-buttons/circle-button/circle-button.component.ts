import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'circle-button',
  templateUrl: './circle-button.component.html',
  styleUrls: ['./circle-button.component.scss']
})
export class CircleButtonComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() popupOpen!: boolean;
  @Output() onClick: EventEmitter<void> = new EventEmitter();
}