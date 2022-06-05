import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'common';
import { ProductProductGroupsManager } from '../../../classes/product-product-groups-manager';
import { ProductGroupsService } from '../../../services/product-groups/product-groups.service';
import { ProductService } from '../../../services/product/product.service';
import { ListComponent } from '../../lists/list/list.component';

@Component({
  selector: 'product-groups-property',
  templateUrl: './product-groups-property.component.html',
  styleUrls: ['./product-groups-property.component.scss']
})
export class ProductGroupsPropertyComponent {
  @ViewChild('listComponent') listComponent!: ListComponent;
  @ViewChild('searchComponent') searchComponent!: ListComponent;
  public productProductGroupsManager: ProductProductGroupsManager = new ProductProductGroupsManager(this.dataService, this.sanitizer, this.productGroupsService, this.productService);

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private productGroupsService: ProductGroupsService, private productService: ProductService) { }

  ngAfterViewChecked() {
    this.productProductGroupsManager.searchComponent = this.searchComponent;
    this.productProductGroupsManager.otherListComponent = this.productGroupsService.formListComponent;
    this.productProductGroupsManager.listComponent = this.productGroupsService.productListComponent = this.listComponent;
    this.productProductGroupsManager.searchInput = document.getElementById('productProductGroupsSearchInput') as HTMLInputElement;
  }
}