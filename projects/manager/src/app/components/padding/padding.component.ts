import { Component, Input } from '@angular/core';
import { Padding, PaddingType } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'padding',
  templateUrl: './padding.component.html',
  styleUrls: ['./padding.component.scss']
})
export class PaddingComponent {
  @Input() padding!: Padding;
  public PaddingType = PaddingType;

  constructor(public widgetService: WidgetService) { }
}
