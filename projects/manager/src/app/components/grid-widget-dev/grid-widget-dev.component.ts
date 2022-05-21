import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridWidgetService, LazyLoadingService } from 'common';
import { GridWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'grid-widget-dev',
  templateUrl: './grid-widget-dev.component.html',
  styleUrls: ['./grid-widget-dev.component.scss']
})
export class GridWidgetDevComponent extends GridWidgetComponent {

  constructor(
    route: ActivatedRoute,
    router: Router,
    lazyLoadingService: LazyLoadingService,
    gridWidgetService: GridWidgetService,
    public widgetService: WidgetService
  ) { super(route, router, lazyLoadingService, gridWidgetService) }

}