import { Component, ComponentFactoryResolver, ComponentRef, Type } from '@angular/core';
import { ColumnComponent, Widget, WidgetData, WidgetType } from 'widgets';
import { WidgetCursorType } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { RowDevComponent } from '../row-dev/row-dev.component';

@Component({
  selector: '[column-dev]',
  templateUrl: './column-dev.component.html',
  styleUrls: ['./column-dev.component.scss']
})
export class ColumnDevComponent extends ColumnComponent {
  public rowComponent!: RowDevComponent;

  constructor(resolver: ComponentFactoryResolver, private widgetService: WidgetService) { super(resolver) }


  // ---------------------------------------------------------------------Create Widget Component Ref----------------------------------------------------------------
  public async createWidgetComponentRef(widgetData: WidgetData): Promise<ComponentRef<Widget>> {
    const widgetComponentRef = await super.createWidgetComponentRef(widgetData);
    const widgetComponent = widgetComponentRef.instance;

    this.setSelectedWidget(widgetComponent);

    widgetComponentRef.location.nativeElement.firstElementChild.addEventListener('mousedown', () => {
      this.setSelectedWidget(widgetComponent);
    });

    return widgetComponentRef;
  }



  // --------------------------------------------------------------------------Set Selected Widget----------------------------------------------------------------
  public setSelectedWidget(widget: Widget) {
    this.widgetService.selectedWidget = widget;
    this.widgetService.selectedRow = this.rowComponent;
    this.widgetService.selectedColumn = this;
  }




  // --------------------------------------------------------------------------Update Column Span----------------------------------------------------------------
  public updateColumnSpan() {
    this.columnSpan.setClasses(this.columnElement);
  }


  // --------------------------------------------------------------------------Get Widget----------------------------------------------------------------
  public async getWidget(widgetType: WidgetType) {
    let widget: Type<Widget> = Widget;

    switch (widgetType) {
      // Button
      case WidgetType.Button:
        const { ButtonWidgetDevComponent } = await import('../button-widget-dev/button-widget-dev.component');
        widget = ButtonWidgetDevComponent;
        break;

      // Text
      case WidgetType.Text:
        const { TextWidgetDevComponent } = await import('../text-widget-dev/text-widget-dev.component');
        widget = TextWidgetDevComponent;
        break;

      // Image
      case WidgetType.Image:
        const { ImageWidgetDevComponent } = await import('../image-widget-dev/image-widget-dev.component');
        widget = ImageWidgetDevComponent;
        break;


      // Container
      case WidgetType.Container:
        const { ContainerWidgetDevComponent } = await import('../container-widget-dev/container-widget-dev.component');
        widget = ContainerWidgetDevComponent;
        break;


      // Line
      case WidgetType.Line:
        const { LineWidgetDevComponent } = await import('../line-widget-dev/line-widget-dev.component');
        widget = LineWidgetDevComponent;
        break;


      // Video
      case WidgetType.Video:
        const { VideoWidgetDevComponent } = await import('../video-widget-dev/video-widget-dev.component');
        widget = VideoWidgetDevComponent;
        break;


      // Product Slider
      case WidgetType.ProductSlider:
        const { ProductSliderWidgetDevComponent } = await import('../product-slider-widget-dev/product-slider-widget-dev.component');
        widget = ProductSliderWidgetDevComponent;
        break;



      // Carousel
      case WidgetType.Carousel:
        const { CarouselWidgetDevComponent } = await import('../carousel-widget-dev/carousel-widget-dev.component');
        widget = CarouselWidgetDevComponent;
        break;

      // Grid
      case WidgetType.Grid:
        const { GridWidgetDevComponent } = await import('../grid-widget-dev/grid-widget-dev.component');
        widget = GridWidgetDevComponent;
        break;
    }

    return widget;
  }


  onMouseenter() {
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.Allowed);
    }
  }

  onMouseleave() {
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.NotAllowed);
    }
  }

  onColumnIndicatorMouseup(addend: number) {
    this.rowComponent.addColumn(addend, this.columnElement);
  }
}