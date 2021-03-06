import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from 'common';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'button-color',
  templateUrl: './button-color.component.html',
  styleUrls: ['./button-color.component.scss']
})
export class ButtonColorComponent {
  @Input() backgroundColor!: Color;
  @Input() borderColor!: Color;
  @Input() textColor!: Color;
  @Output() onChange: EventEmitter<void> = new EventEmitter();

  constructor(public widgetService: WidgetService) { }
}