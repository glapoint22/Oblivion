import { Component, Input } from '@angular/core';
import { PropertyView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { PageDevComponent } from '../page-dev/page-dev.component';

@Component({
  selector: 'widget-inspector',
  templateUrl: './widget-inspector.component.html',
  styleUrls: ['./widget-inspector.component.scss']
})
export class WidgetInspectorComponent {
  @Input() page!: PageDevComponent;
  public currentPropertyView!: PropertyView;
  public propertyView = PropertyView;

  constructor(public widgetService: WidgetService) { }


  onNewPageClick() {
    this.currentPropertyView = PropertyView.Page;
    this.page.newPage();
  }
}