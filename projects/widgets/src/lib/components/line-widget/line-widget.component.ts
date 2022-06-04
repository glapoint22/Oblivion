import { Component } from '@angular/core';
import { Border } from '../../classes/border';
import { LineWidgetData } from '../../classes/line-widget-data';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'line-widget',
  templateUrl: './line-widget.component.html',
  styleUrls: ['./line-widget.component.scss']
})
export class LineWidgetComponent extends Widget {
  public border: Border = new Border();
  public shadow: Shadow = new Shadow();



  // ------------------------------------------------------------ Ng On Init -----------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Line;
  }
  



  // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
  setWidget(lineWidgetData: LineWidgetData) {
    this.border.setData(lineWidgetData.border);
    this.shadow.setData(lineWidgetData.shadow);

    super.setWidget(lineWidgetData);
  }



  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): LineWidgetData {
    const lineWidgetData = super.getData() as LineWidgetData;

    lineWidgetData.border = this.border.getData();
    lineWidgetData.shadow = this.shadow.getData();

    return lineWidgetData;
  }
}