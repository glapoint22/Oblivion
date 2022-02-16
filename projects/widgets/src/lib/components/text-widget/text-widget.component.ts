import { AfterViewInit, Component } from '@angular/core';
import { Background } from '../../classes/background';
import { Padding } from '../../classes/padding';
import { TextWidgetData } from '../../classes/text-widget-data';
import { Widget } from '../../classes/widget';

@Component({
  selector: 'text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.scss']
})
export class TextWidgetComponent extends Widget implements AfterViewInit {
  public background!: Background;
  private htmlContent!: string;
  private padding!: Padding;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.widgetElement.innerHTML = this.htmlContent;
    this.padding.setClass(this.widgetElement, this.breakpoints);
  }

  setWidget(textWidgetData: TextWidgetData) {
    this.htmlContent = textWidgetData.htmlContent;
    this.background = textWidgetData.background;
    this.padding = new Padding(textWidgetData.padding);

    super.setWidget(textWidgetData);
  }

}
