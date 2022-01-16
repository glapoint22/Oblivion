import { AfterViewInit, Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { Breakpoint } from '../../classes/breakpoint';
import { Column } from '../../classes/column';
import { ColumnSpan } from '../../classes/column-span';
import { Corners } from '../../classes/corners';
import { WidgetType } from '../../classes/enums';
import { Padding } from '../../classes/padding';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { WidgetData } from '../../classes/widget-data';
import { ButtonWidgetComponent } from '../button-widget/button-widget.component';
import { CarouselWidgetComponent } from '../carousel-widget/carousel-widget.component';
import { ContainerWidgetComponent } from '../container-widget/container-widget.component';
import { GridWidgetComponent } from '../grid-widget/grid-widget.component';
import { ImageWidgetComponent } from '../image-widget/image-widget.component';
import { LineWidgetComponent } from '../line-widget/line-widget.component';
import { ProductSliderWidgetComponent } from '../product-slider-widget/product-slider-widget.component';
import { TextWidgetComponent } from '../text-widget/text-widget.component';
import { VideoWidgetComponent } from '../video-widget/video-widget.component';

@Component({
  selector: '[column]',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements AfterViewInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;
  public background!: Background;
  public border!: Border;
  public corners!: Corners;
  public shadow!: Shadow;
  private padding!: Padding;
  private columnSpan!: ColumnSpan;
  private breakpoints!: Array<Breakpoint>;

  constructor(private resolver: ComponentFactoryResolver) { }

  ngAfterViewInit(): void {
    // Get the html column element
    const columnElement: HTMLElement = this.viewContainerRef.element.nativeElement.parentElement;
    
    this.columnSpan.setClass(columnElement.parentElement as HTMLElement, this.breakpoints);
    this.padding.setClass(columnElement, this.breakpoints);
  }


  setColumn(column: Column) {
    this.background = column.background;
    this.border = column.border;
    this.corners = column.corners;
    this.shadow = column.shadow;
    this.breakpoints = column.breakpoints;
    this.columnSpan = new ColumnSpan(column.columnSpan);
    this.padding = new Padding(column.padding);
  }


  createWidget(widgetData: WidgetData): void {
    const componentFactory = this.resolver.resolveComponentFactory(this.getWidget(widgetData.widgetType));
    const widgetComponentRef = this.viewContainerRef.createComponent(componentFactory);
    const widgetComponent = widgetComponentRef.instance;

    // Set the widget with the widget data
    widgetComponent.setWidget(widgetData);


    // Detect changes
    widgetComponentRef.hostView.detectChanges();
  }


  // -----------------------------( GET WIDGET )------------------------------ \\
  getWidget(widgetType: WidgetType) {
    let widget: Type<Widget> = Widget;

    switch (widgetType) {
      // Button
      case WidgetType.Button:
        widget = ButtonWidgetComponent;
        break;

      // Text
      case WidgetType.Text:
        widget = TextWidgetComponent;
        break;

      // Image
      case WidgetType.Image:
        widget = ImageWidgetComponent;
        break;


      // Container
      case WidgetType.Container:
        widget = ContainerWidgetComponent;
        break;


      // Line
      case WidgetType.Line:
        widget = LineWidgetComponent;
        break;


      // Video
      case WidgetType.Video:
        widget = VideoWidgetComponent;
        break;


      // Product Slider
      case WidgetType.ProductSlider:
        widget = ProductSliderWidgetComponent;
        break;



      // Carousel
      case WidgetType.Carousel:
        widget = CarouselWidgetComponent;
        break;

      // Grid
      case WidgetType.Grid:
        widget = GridWidgetComponent;
        break;
    }

    return widget;
  }
}