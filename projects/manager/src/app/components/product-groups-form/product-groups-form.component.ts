import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { ProductGroupsFormManager } from '../../classes/product-groups-form-manager';
import { ProductGroupsService } from '../../services/product-groups/product-groups.service';
import { ProductService } from '../../services/product/product.service';
import { ListComponent } from '../lists/list/list.component';

@Component({
  selector: 'product-groups-form',
  templateUrl: './product-groups-form.component.html',
  styleUrls: ['./product-groups-form.component.scss']
})
export class ProductGroupsFormComponent extends LazyLoad {
  @ViewChild('listComponent') listComponent!: ListComponent;
  @ViewChild('searchComponent') searchComponent!: ListComponent;
  public productGroupsFormManager: ProductGroupsFormManager = new ProductGroupsFormManager(this.dataService, this.sanitizer, this.productGroupsService, this.productService);
  
  
  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer, private productGroupsService: ProductGroupsService, private productService: ProductService) {
    super(lazyLoadingService);
    this.productGroupsFormManager.onClose.subscribe(() => {
      this.close();
    })
  }

  ngAfterViewChecked() {
    this.productGroupsFormManager.searchComponent = this.searchComponent;
    this.productGroupsFormManager.otherListComponent = this.productGroupsService.productListComponent;
    this.productGroupsFormManager.listComponent = this.productGroupsService.formListComponent = this.listComponent;
    this.productGroupsFormManager.searchInput = document.getElementById('productGroupsFormSearchInput') as HTMLInputElement;
  }

  onOpen(): void {
    this.productGroupsFormManager.onOpen();
  }

  onEscape(): void {
    this.productGroupsFormManager.onEscape();
  }
}