import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { ImageItem } from '../../classes/image-item';

@Component({
  templateUrl: './disabled-products-form.component.html',
  styleUrls: ['./disabled-products-form.component.scss']
})
export class DisabledProductsFormComponent extends LazyLoad {
  public disabledProducts: Array<ImageItem> = new Array<ImageItem>();
  
  onOpen() {
    this.disabledProducts.push({image: 'sfdsf', name: 'trumpy'})
  }
}