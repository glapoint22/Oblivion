import { Component, Input, OnInit } from '@angular/core';
import { DataService, MediaType, Video } from 'common';
import { Product } from 'projects/manager/src/app/classes/product';
import { ProductMedia } from 'projects/manager/src/app/classes/product-media';
import { ProductService } from 'projects/manager/src/app/services/product/product.service';
import { ProductFormComponent } from '../../product-form/product-form.component';

@Component({
  template: '',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  public productMediaSpacing: number = 57;
  @Input() product!: Product;
  @Input() productForm!: ProductFormComponent;

  constructor(public dataService: DataService, public productService: ProductService) { }


  ngOnInit() {
      this.productForm.selectedProductMedia = this.product.media[0];
  }



  // --------------------------------------------------- Set Video ---------------------------------------------------
  setVideo(productMedia: ProductMedia) {
    window.setTimeout(() => {
      const iframe = document.getElementById('video-iframe') as HTMLIFrameElement;
      const src = new Video({
        video: {
          id: productMedia.id,
          name: productMedia.name,
          thumbnail: productMedia.thumbnail,
          videoType: productMedia.videoType,
          videoId: productMedia.videoId
        }
      }).src;

      if (iframe.src != src) iframe.src = src;
    });
  }


  // --------------------------------------------------- On Media Select ---------------------------------------------------
  onMediaSelect(productMedia: ProductMedia) {
    productMedia.transition = 'all 0ms ease 0s';
    if (productMedia.type == MediaType.Video) this.setVideo(productMedia);
    this.productForm.selectedProductMedia = productMedia;
  }





  updateIndices() {
    this.dataService.put('api/Products/Media/Indices', {
      productId: this.product.id,
      productMedia: this.product.media.map((media: ProductMedia) => {
        return {
          productMediaId: media.productMediaId,
          index: media.index
        }
      })
    }).subscribe();
  }
}