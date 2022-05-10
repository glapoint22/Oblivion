import { Component } from '@angular/core';
import { WidgetService } from '../../services/widget/widget.service';
import { TextWidgetDevComponent } from '../text-widget-dev/text-widget-dev.component';

@Component({
  selector: 'text-widget-properties',
  templateUrl: './text-widget-properties.component.html',
  styleUrls: ['./text-widget-properties.component.scss']
})
export class TextWidgetPropertiesComponent {
  public textWidget!: TextWidgetDevComponent

  constructor(public widgetService: WidgetService) { }

  ngDoCheck(): void {
    this.textWidget = this.widgetService.selectedWidget as TextWidgetDevComponent;
  }

  update() {
    // this.widgetService.$update.next();
  }
}
