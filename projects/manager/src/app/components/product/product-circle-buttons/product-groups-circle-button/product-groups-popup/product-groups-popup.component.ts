import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ProductProductGroupsComponent } from '../../../../product-product-groups/product-product-groups.component';

@Component({
  selector: 'app-product-groups-popup',
  templateUrl: './product-groups-popup.component.html',
  styleUrls: ['./product-groups-popup.component.scss']
})
export class ProductGroupsPopupComponent extends LazyLoad {
  public productId!: number;
  public productIndex!: number;
  public onClose: Subject<void> = new Subject<void>();
  @ViewChild('productProductGroups') productProductGroups!: ProductProductGroupsComponent;

  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }

  mousedown = () => {
    this.close();
  }

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

  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
 }