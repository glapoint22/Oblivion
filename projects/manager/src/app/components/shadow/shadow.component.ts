import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Shadow } from 'widgets';

@Component({
  selector: 'shadow',
  templateUrl: './shadow.component.html',
  styleUrls: ['./shadow.component.scss']
})
export class ShadowComponent {
  @Input() shadow!: Shadow;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
}