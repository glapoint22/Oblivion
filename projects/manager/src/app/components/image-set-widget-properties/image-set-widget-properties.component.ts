import { Component } from '@angular/core';
import { ImageSetWidgetDevComponent } from '../image-set-widget-dev/image-set-widget-dev.component';
import { WidgetProperties } from '../../classes/widget-properties';
import { WidgetService } from '../../services/widget/widget.service';
import { CounterComponent } from '../counter/counter.component';
import { CarouselBanner } from 'widgets';

@Component({
  selector: 'image-set-widget-properties',
  templateUrl: './image-set-widget-properties.component.html',
  styleUrls: ['./image-set-widget-properties.component.scss']
})
export class ImageSetWidgetPropertiesComponent extends WidgetProperties<ImageSetWidgetDevComponent> {
  constructor(widgetService: WidgetService) { super(widgetService) }


  // --------------------------------------------------------------------- Add Image --------------------------------------------------------
  addImage(counter: CounterComponent) {
    this.widget.images.push(new CarouselBanner());
    counter.set(this.widget.images.length);
    this.widget.currentImageIndex = this.widget.images.length - 1;
    this.update();
  }


  // --------------------------------------------------------------------- Delete Image --------------------------------------------------------
  deleteImage(counter: CounterComponent) {
    if (this.widget.images[this.widget.currentImageIndex].image && this.widget.images[this.widget.currentImageIndex].image.src) {
      // Remove the image
      this.widget.images.splice(this.widget.currentImageIndex, 1);

      // If we still have images left
      if (this.widget.images.length > 0) {
        this.widget.currentImageIndex = Math.min(this.widget.images.length - 1, this.widget.currentImageIndex);
        counter.set(this.widget.currentImageIndex + 1);
      }

      this.update();
    }
  }
}