import { Component } from '@angular/core';
import { Border } from '../../classes/border';
import { LineWidgetData } from '../../classes/line-widget-data';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';

@Component({
  selector: 'line-widget',
  templateUrl: './line-widget.component.html',
  styleUrls: ['./line-widget.component.scss']
})
export class LineWidgetComponent extends Widget {
  public border!: Border;
  public shadow!: Shadow;
  
  setWidget(lineWidgetData: LineWidgetData) {
    this.border = lineWidgetData.border;
    this.shadow = lineWidgetData.shadow;

    super.setWidget(lineWidgetData);
  }
}