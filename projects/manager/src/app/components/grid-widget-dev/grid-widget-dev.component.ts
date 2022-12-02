import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadingService } from 'common';
import { GridWidgetComponent, GridWidgetData } from 'widgets';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'grid-widget-dev',
  templateUrl: './grid-widget-dev.component.html',
  styleUrls: ['./grid-widget-dev.component.scss']
})
export class GridWidgetDevComponent extends GridWidgetComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(
    route: ActivatedRoute,
    router: Router,
    lazyLoadingService: LazyLoadingService,
    public widgetService: WidgetService
  ) { super(route, router, lazyLoadingService, null!) }


  // -------------------------------------------------------------- Set Widget ------------------------------------------------------------------
  setWidget(gridWidgetData: GridWidgetData): void { }
}