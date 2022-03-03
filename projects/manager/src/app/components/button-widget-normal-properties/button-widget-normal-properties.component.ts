import { Component, Input } from '@angular/core';
import { WidgetService } from '../../services/widget/widget.service';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';

@Component({
  selector: 'button-widget-normal-properties',
  templateUrl: './button-widget-normal-properties.component.html',
  styleUrls: ['./button-widget-normal-properties.component.scss']
})
export class ButtonWidgetNormalPropertiesComponent {
  @Input() buttonWidget!: ButtonWidgetDevComponent;

  constructor(public widgetService: WidgetService) { }

  update() {
    this.widgetService.$update.next();
  }
}