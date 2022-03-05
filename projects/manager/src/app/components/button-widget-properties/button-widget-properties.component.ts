import { Component, DoCheck } from '@angular/core';
import { ButtonState } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';

@Component({
  selector: 'button-widget-properties',
  templateUrl: './button-widget-properties.component.html',
  styleUrls: ['./button-widget-properties.component.scss']
})
export class ButtonWidgetPropertiesComponent implements DoCheck {
  public buttonWidget!: ButtonWidgetDevComponent
  public buttonState = ButtonState;

  constructor(public widgetService: WidgetService) { }

  ngDoCheck(): void {
    this.buttonWidget = this.widgetService.selectedWidget as ButtonWidgetDevComponent;
  }
}