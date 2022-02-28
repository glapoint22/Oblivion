import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { Column } from '../../classes/column';
import { ColumnSpan } from '../../classes/column-span';
import { Corners } from '../../classes/corners';
import { Padding } from '../../classes/padding';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { WidgetData } from '../../classes/widget-data';
import { WidgetType } from '../../classes/widget-enums';

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
  public columnElement!: HTMLElement;
  private padding: Padding = new Padding();
  public columnSpan!: ColumnSpan;

  constructor(public resolver: ComponentFactoryResolver) { }

  ngAfterViewInit(): void {
    this.columnSpan.setClass(this.columnElement);
    this.padding.setClasses(this.columnElement);
  }


  setColumn(column: Column) {
    this.background = column.background;
    this.border = column.border;
    this.corners = column.corners;
    this.shadow = column.shadow;
    this.columnSpan = new ColumnSpan(column.columnSpan);
    this.padding.setData(column.padding);
  }


  async createWidget(widgetData: WidgetData) {
    // const componentFactory = this.resolver.resolveComponentFactory(await this.getWidget(widgetData.widgetType));
    const widgetComponentRef =  await this.createWidgetComponentRef(widgetData)
    const widgetComponent = widgetComponentRef.instance;

    // Set the widget with the widget data
    widgetComponent.setWidget(widgetData);


    // Detect changes
    widgetComponentRef.hostView.detectChanges();
  }


  async createWidgetComponentRef(widgetData: WidgetData): Promise<ComponentRef<Widget>> {
    const componentFactory = this.resolver.resolveComponentFactory(await this.getWidget(widgetData.widgetType));
    const widgetComponentRef = this.viewContainerRef.createComponent(componentFactory);

    return widgetComponentRef;
  }


  // -----------------------------( GET WIDGET )------------------------------ \\
  async getWidget(widgetType: WidgetType) {
    let widget: Type<Widget> = Widget;

    switch (widgetType) {
      // Button
      case WidgetType.Button:
        const { ButtonWidgetComponent } = await import('../button-widget/button-widget.component');
        widget = ButtonWidgetComponent;
        break;

      // Text
      case WidgetType.Text:
        const { TextWidgetComponent } = await import('../text-widget/text-widget.component');
        widget = TextWidgetComponent;
        break;

      // Image
      case WidgetType.Image:
        const { ImageWidgetComponent } = await import('../image-widget/image-widget.component');
        widget = ImageWidgetComponent;
        break;


      // Container
      case WidgetType.Container:
        const { ContainerWidgetComponent } = await import('../container-widget/container-widget.component');
        widget = ContainerWidgetComponent;
        break;


      // Line
      case WidgetType.Line:
        const { LineWidgetComponent } = await import('../line-widget/line-widget.component');
        widget = LineWidgetComponent;
        break;


      // Video
      case WidgetType.Video:
        const { VideoWidgetComponent } = await import('../video-widget/video-widget.component');
        widget = VideoWidgetComponent;
        break;


      // Product Slider
      case WidgetType.ProductSlider:
        const { ProductSliderWidgetComponent } = await import('../product-slider-widget/product-slider-widget.component');
        widget = ProductSliderWidgetComponent;
        break;



      // Carousel
      case WidgetType.Carousel:
        const { CarouselWidgetComponent } = await import('../carousel-widget/carousel-widget.component');
        widget = CarouselWidgetComponent;
        break;

      // Grid
      case WidgetType.Grid:
        const { GridWidgetComponent } = await import('../grid-widget/grid-widget.component');
        widget = GridWidgetComponent;
        break;
    }

    return widget;
  }
}