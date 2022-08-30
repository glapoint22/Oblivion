import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HorizontalAlignment, HorizontalAlignmentType, HorizontalAlignmentValue } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'horizontal-alignment',
  templateUrl: './horizontal-alignment.component.html',
  styleUrls: ['./horizontal-alignment.component.scss']
})
export class HorizontalAlignmentComponent {

  @Input() horizontalAlignment!: HorizontalAlignment;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  public HorizontalAlignmentType = HorizontalAlignmentType;

  constructor(public widgetService: WidgetService) { }

  setValue(horizontalAlignmentType: HorizontalAlignmentType) {
    if (horizontalAlignmentType == HorizontalAlignmentType.Left) {
      this.horizontalAlignment.values = [];
    } else if (this.horizontalAlignment.values.length == 0) {
      this.horizontalAlignment.values.push(new HorizontalAlignmentValue(horizontalAlignmentType, 0));
    } else {
      this.horizontalAlignment.values[0].horizontalAlignmentType = horizontalAlignmentType;
    }

    this.onChange.emit();
  }
}