import { Component } from '@angular/core';
import { ButtonWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'button-widget-dev',
  templateUrl: './button-widget-dev.component.html',
  styleUrls: ['./button-widget-dev.component.scss']
})
export class ButtonWidgetDevComponent extends ButtonWidgetComponent {

  constructor(public widgetService: WidgetService) { super() }

  onHandleMousedown() {
    this.widgetService.$widgetResize.next('ns-resize');

    window.addEventListener('mouseup', this.onHandleMouseup);
  }


  onHandleMouseup = ()=> {
    this.widgetService.$widgetResize.next('default');

    window.removeEventListener('mouseup', this.onHandleMouseup);
  }
}
