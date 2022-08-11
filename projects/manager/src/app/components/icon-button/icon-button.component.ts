import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() isDisabled!: boolean | undefined | null;
  @Input() fontSize!: string;
  @Output() onClick: EventEmitter<void> = new EventEmitter();
}