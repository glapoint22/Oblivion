import { Component, OnInit } from '@angular/core';
import { Background, Border, Corners, Padding, Shadow, VerticalAlignment } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'row-properties',
  templateUrl: './row-properties.component.html',
  styleUrls: ['./row-properties.component.scss']
})
export class RowPropertiesComponent implements OnInit {
  public background!: Background;
  public border!: Border;
  public corners!: Corners;
  public shadow!: Shadow;
  public padding!: Padding;
  public verticalAlignment!: VerticalAlignment;

  constructor(public widgetService: WidgetService) { }

  ngOnInit(): void {
      this.background = this.widgetService.selectedRow.background;
      this.border = this.widgetService.selectedRow.border;
      this.corners = this.widgetService.selectedRow.corners;
      this.shadow = this.widgetService.selectedRow.shadow;
      this.padding = this.widgetService.selectedRow.padding;
      this.verticalAlignment = this.widgetService.selectedRow.verticalAlignment;
  }

  update() {
    this.widgetService.$update.next();
  }
}