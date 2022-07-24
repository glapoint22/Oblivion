import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductPropertiesComponent } from '../../components/product-properties/product-properties.component';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'product-builder',
  templateUrl: './product-builder.component.html',
  styleUrls: ['./product-builder.component.scss']
})
export class ProductBuilderComponent {

  constructor(public productService: ProductService){

  }

  @ViewChild('productsContainer', { read: ViewContainerRef }) productsContainer!: ViewContainerRef;

  ngAfterViewInit(){
    this.productService.productsContainer = this.productsContainer;
  }


  onTabMouseDown(productComponent: ProductPropertiesComponent){
    this.productService.zIndex++;
    productComponent.zIndex = this.productService.zIndex++;
  }
}