import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, DataService } from 'common';
import { PopupArrowPosition } from '../../classes/enums';
import { Product } from '../../classes/product';

@Component({
  template: '',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  public popupOpen!: boolean;
  public PopupArrowPosition = PopupArrowPosition;
  @Input() product!: Product;
  @ViewChild('addPopupContainer', { read: ViewContainerRef }) addPopupContainer!: ViewContainerRef;
  @ViewChild('editPopupContainer', { read: ViewContainerRef }) editPopupContainer!: ViewContainerRef;
  constructor(public lazyLoadingService: LazyLoadingService, public dataService: DataService) { }
}