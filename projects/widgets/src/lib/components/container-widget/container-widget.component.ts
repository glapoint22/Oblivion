import { Component, ViewChild } from '@angular/core';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { ContainerWidgetData } from '../../classes/container-widget-data';
import { Corners } from '../../classes/corners';
import { Padding } from '../../classes/padding';
import { Row } from '../../classes/row';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'container-widget',
  templateUrl: './container-widget.component.html',
  styleUrls: ['./container-widget.component.scss']
})
export class ContainerWidgetComponent extends Widget {
  @ViewChild('container', { static: false }) container!: ContainerComponent;
  public corners: Corners = new Corners();
  public shadow: Shadow = new Shadow();
  public background: Background = new Background('#484848');
  public border: Border = new Border();
  public padding: Padding = new Padding();
  private rows!: Array<Row>;


  // ---------------------------------------------------------------- Ng On Init ---------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Container;
  }





  // ------------------------------------------------------------ Ng After View Init -----------------------------------------------------------
  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.padding.setClasses(this.widgetElement);

    if (this.rows && this.rows.length > 0) {
      // Loop through the rows
      this.rows.forEach((row: Row) => {

        // Create the row
        this.container.createRow(row);
      });
    }
  }


  // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
  setWidget(containerWidgetData: ContainerWidgetData) {
    this.background.setData(containerWidgetData.background);
    this.border.setData(containerWidgetData.border);
    this.corners.setData(containerWidgetData.corners);
    this.shadow.setData(containerWidgetData.shadow);
    this.padding.setData(containerWidgetData.padding);
    this.rows = containerWidgetData.rows;

    super.setWidget(containerWidgetData);
  }



  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): ContainerWidgetData {
    throw new Error('Method not implemented.');
  }
}