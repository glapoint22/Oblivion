import { Component, Type } from '@angular/core';
import { ColumnComponent, Widget, WidgetType } from 'widgets';

@Component({
  selector: '[column-dev]',
  templateUrl: './column-dev.component.html',
  styleUrls: ['./column-dev.component.scss']
})
export class ColumnDevComponent extends ColumnComponent {

  // -----------------------------( GET WIDGET )------------------------------ \\
  async getWidget(widgetType: WidgetType) {
    let widget: Type<Widget> = Widget;

    switch (widgetType) {
      // Button
      case WidgetType.Button:
        const { ButtonWidgetDevComponent } = await import('../button-widget-dev/button-widget-dev.component');
        widget = ButtonWidgetDevComponent;
        break;

      // Text
      // case WidgetType.Text:
      //   const { TextWidgetComponent } = await import('../text-widget/text-widget.component');
      //   widget = TextWidgetComponent;
      //   break;

      // // Image
      // case WidgetType.Image:
      //   const { ImageWidgetComponent } = await import('../image-widget/image-widget.component');
      //   widget = ImageWidgetComponent;
      //   break;


      // // Container
      // case WidgetType.Container:
      //   const { ContainerWidgetComponent } = await import('../container-widget/container-widget.component');
      //   widget = ContainerWidgetComponent;
      //   break;


      // // Line
      // case WidgetType.Line:
      //   const { LineWidgetComponent } = await import('../line-widget/line-widget.component');
      //   widget = LineWidgetComponent;
      //   break;


      // // Video
      // case WidgetType.Video:
      //   const { VideoWidgetComponent } = await import('../video-widget/video-widget.component');
      //   widget = VideoWidgetComponent;
      //   break;


      // // Product Slider
      // case WidgetType.ProductSlider:
      //   const { ProductSliderWidgetComponent } = await import('../product-slider-widget/product-slider-widget.component');
      //   widget = ProductSliderWidgetComponent;
      //   break;



      // // Carousel
      // case WidgetType.Carousel:
      //   const { CarouselWidgetComponent } = await import('../carousel-widget/carousel-widget.component');
      //   widget = CarouselWidgetComponent;
      //   break;

      // // Grid
      // case WidgetType.Grid:
      //   const { GridWidgetComponent } = await import('../grid-widget/grid-widget.component');
      //   widget = GridWidgetComponent;
      //   break;
    }

    return widget;
  }
}
