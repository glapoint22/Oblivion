import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { ProductProductGroupsComponent } from '../product-product-groups/product-product-groups.component';

@Component({
  selector: 'app-product-groups-popup',
  templateUrl: './product-groups-popup.component.html',
  styleUrls: ['./product-groups-popup.component.scss']
})
export class ProductGroupsPopupComponent extends LazyLoad {
  @ViewChild('productProductGroups') productProductGroups!: ProductProductGroupsComponent;


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.productProductGroups.onClose.subscribe(() => this.close());
  }


  onOpen(): void {
    this.productProductGroups.onOpen();
  }

  onEscape(): void {
    this.productProductGroups.onEscape();
  }
 }