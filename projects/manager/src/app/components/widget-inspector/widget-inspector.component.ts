import { Component, Input } from '@angular/core';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { PageDevComponent } from '../page-dev/page-dev.component';

@Component({
  selector: 'widget-inspector',
  templateUrl: './widget-inspector.component.html',
  styleUrls: ['./widget-inspector.component.scss']
})
export class WidgetInspectorComponent {
  @Input() page!: PageDevComponent;
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { }


  onNewPageClick() {
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;
    this.page.newPage();
  }
}