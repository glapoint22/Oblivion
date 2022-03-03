import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Caption } from 'widgets';

@Component({
  selector: 'caption-property',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss']
})
export class CaptionComponent {
  @Input() caption!: Caption;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
}