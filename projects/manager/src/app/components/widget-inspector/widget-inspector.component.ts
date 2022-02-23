import { Component } from '@angular/core';
import { LazyLoad, LazyLoadingService } from 'common';
import { PropertyView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'widget-inspector',
  templateUrl: './widget-inspector.component.html',
  styleUrls: ['./widget-inspector.component.scss']
})
export class WidgetInspectorComponent extends LazyLoad {
  public currentPropertyView!: PropertyView;
  public propertyView = PropertyView;

  constructor(lazyLoadingService: LazyLoadingService, public widgetService: WidgetService) { super(lazyLoadingService)}

  
  onNewPageClick() {
    this.currentPropertyView = PropertyView.Page;
    this.widgetService.page.newPage();
  }
}