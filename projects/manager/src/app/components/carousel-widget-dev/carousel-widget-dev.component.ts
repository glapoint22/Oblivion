import { Component } from '@angular/core';
import { CarouselWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'carousel-widget-dev',
  templateUrl: './carousel-widget-dev.component.html',
  styleUrls: ['./carousel-widget-dev.component.scss']
})
export class CarouselWidgetDevComponent extends CarouselWidgetComponent {
  public currentBannerIndex: number = 0;

  constructor(public widgetService: WidgetService) { super() }
}