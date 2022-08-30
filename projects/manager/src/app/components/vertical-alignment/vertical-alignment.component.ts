import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VerticalAlignment, VerticalAlignmentType, VerticalAlignmentValue } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'vertical-alignment',
  templateUrl: './vertical-alignment.component.html',
  styleUrls: ['./vertical-alignment.component.scss']
})
export class VerticalAlignmentComponent {
  @Input() verticalAlignment!: VerticalAlignment;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  public VerticalAlignmentType = VerticalAlignmentType;

  constructor(public widgetService: WidgetService) { }

  setValue(verticalAlignmentType: VerticalAlignmentType) {
    if (verticalAlignmentType == VerticalAlignmentType.Top) {
      this.verticalAlignment.values = [];
    } else if (this.verticalAlignment.values.length == 0) {
      this.verticalAlignment.values.push(new VerticalAlignmentValue(verticalAlignmentType, 0));
    } else {
      this.verticalAlignment.values[0].verticalAlignmentType = verticalAlignmentType;
    }

    this.onChange.emit();
  }
}