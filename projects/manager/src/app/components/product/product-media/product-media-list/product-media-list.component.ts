import { Component } from '@angular/core';
import { MediaComponent } from '../media/media.component';

@Component({
  selector: 'product-media-list',
  templateUrl: './product-media-list.component.html',
  styleUrls: ['../media/media.component.scss', './product-media-list.component.scss']
})
export class ProductMediaListComponent extends MediaComponent {
  

  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit(): void {
    if (this.product && this.product.media && this.product.media.length > 0) {
      super.ngOnInit();

      for (let i = 0; i < this.product.media.length; i++) {
        const productMedia = this.product.media[i];
        productMedia.top = this.productMediaSpacing * productMedia.index;
      }
    }
  }



  // ===================================================================( ON MOUSEDOWN )==================================================================== \\

  onMousedown(mousedownEvent: MouseEvent) {
    const mediaContainerElement = (mousedownEvent.target as HTMLElement).parentElement?.parentElement!;
    const mediaContainerElementScrollHeight = mediaContainerElement.scrollHeight;
    const mediaContainerElementHeight = mediaContainerElement.clientHeight;
    let currentMediaTop: number;
    let yPos = mousedownEvent.clientY;


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      // Get the direction of the mouse move
      const direction = Math.sign(yPos - mousemoveEvent.clientY);
      yPos = mousemoveEvent.clientY;

      // Assign the top to the media we are moving
      this.productForm.selectedProductMedia.top = Math.min(mediaContainerElementScrollHeight - 50, Math.max(0, this.productForm.selectedProductMedia.top + mousemoveEvent.movementY));

      // This is the current media top we are moving over
      currentMediaTop = Math.round(this.productForm.selectedProductMedia.top / this.productMediaSpacing) * this.productMediaSpacing;

      // Get the current media using the current media top
      const currentMedia = this.product.media.find(x => x.top == currentMediaTop);

      // This will move the current media to a new location and assign its index
      if (currentMedia && currentMedia != this.productForm.selectedProductMedia) {
        currentMedia.transition = 'all 200ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';
        currentMedia.index = currentMedia.index + 1 * direction;
        currentMedia.top = currentMedia.index * this.productMediaSpacing;
      }

      // Set the scrollbar
      if (this.productForm.selectedProductMedia.top < mediaContainerElement.scrollTop) {
        mediaContainerElement?.scrollTo(0, mediaContainerElement.scrollTop + mousemoveEvent.movementY)
      }

      if (this.productForm.selectedProductMedia.top > mediaContainerElementHeight - 50) {
        mediaContainerElement?.scrollTo(0, mediaContainerElement.scrollTop + mousemoveEvent.movementY)
      }
    }

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);

      // Set the selected media's top and index
      if (currentMediaTop != undefined) {
        this.productForm.selectedProductMedia.top = Math.min((this.product.media.length - 1) * this.productMediaSpacing, currentMediaTop);
        this.productForm.selectedProductMedia.index = Math.round(this.productForm.selectedProductMedia.top / this.productMediaSpacing);
        this.productForm.selectedProductMedia.transition = 'all 200ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';

        // Update the indices
        this.updateIndices();
      }
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  }
}