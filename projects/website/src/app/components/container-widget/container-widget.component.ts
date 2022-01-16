import { Component, ViewChild } from '@angular/core';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { ContainerWidgetData } from '../../classes/container-widget-data';
import { Corners } from '../../classes/corners';
import { Padding } from '../../classes/padding';
import { Row } from '../../classes/row';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'container-widget',
  templateUrl: './container-widget.component.html',
  styleUrls: ['./container-widget.component.scss']
})
export class ContainerWidgetComponent extends Widget {
  @ViewChild('container', { static: false }) container!: ContainerComponent;
  public corners!: Corners;
  public shadow!: Shadow;
  public background!: Background;
  public border!: Border;
  private padding!: Padding;
  private rows!: Array<Row>;


  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.padding.setClass(this.widgetElement, this.breakpoints);

    if (this.rows && this.rows.length > 0) {
      // Loop through the rows
      this.rows.forEach((row: Row) => {

        // Create the row
        this.container.createRow(row);
      });
    }
  }


  setWidget(containerWidgetData: ContainerWidgetData) {
    this.background = containerWidgetData.background;
    this.border = containerWidgetData.border;
    this.corners = containerWidgetData.corners;
    this.shadow = containerWidgetData.shadow;
    this.rows = containerWidgetData.rows;
    this.padding = new Padding(containerWidgetData.padding);

    super.setWidget(containerWidgetData);
  }
}