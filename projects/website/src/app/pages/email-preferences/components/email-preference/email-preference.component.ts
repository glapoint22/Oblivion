import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'email-preference',
  templateUrl: './email-preference.component.html',
  styleUrls: ['./email-preference.component.scss']
})
export class EmailPreferenceComponent {
  @Input() text!: string;
  @Input() checked!: boolean;
  @Output() onChange: EventEmitter<boolean> = new EventEmitter();
}