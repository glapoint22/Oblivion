import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownType } from 'common';
import { Caption } from 'widgets';

@Component({
  selector: 'caption-property',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss']
})
export class CaptionComponent {
  public DropdownType = DropdownType;
  @Input() caption!: Caption;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
}