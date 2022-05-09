import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { ContainerWidgetDevComponent } from '../container-widget-dev/container-widget-dev.component';

@Component({
  selector: 'container-widget-properties',
  templateUrl: './container-widget-properties.component.html',
  styleUrls: ['./container-widget-properties.component.scss']
})
export class ContainerWidgetPropertiesComponent extends WidgetProperties<ContainerWidgetDevComponent> { }