import { Component } from '@angular/core';
import { ContainerWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'container-widget-dev',
  templateUrl: './container-widget-dev.component.html',
  styleUrls: ['./container-widget-dev.component.scss']
})
export class ContainerWidgetDevComponent extends ContainerWidgetComponent {

  constructor(public widgetService: WidgetService) { super() }

  ngOnInit(): void {
    this.height = 250;
    super.ngOnInit();
  }
}