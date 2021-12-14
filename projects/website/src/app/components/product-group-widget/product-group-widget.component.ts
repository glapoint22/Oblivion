import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../classes/product';

@Component({
  selector: 'product-group-widget',
  templateUrl: './product-group-widget.component.html',
  styleUrls: ['./product-group-widget.component.scss']
})
export class ProductGroupWidgetComponent implements OnInit {
  @Input() products!: Array<Product>;
  @Input() caption!: string;
  public translate: number = 0;
  private currentPage: number = 1;
  public productWidth: number = 250;
  private currentTranslation: number = 0;
  private translations: Array<number> = [this.currentTranslation];

  constructor() { }

  ngOnInit(): void {
  }



  onRightButtonClick(containerWidth: number) {
    // Increment the page
    this.currentPage++;

    // Calculate how much to move the slider
    this.currentTranslation = this.translate = containerWidth + this.currentTranslation;
    this.translations.push(this.currentTranslation);
  }


  onLeftButtonClick() {
    // Get the previous translation from the array to move the slider back
    this.currentTranslation = this.translate = this.translations[this.translations.length - 2];
    this.currentPage--;
    this.translations.pop();
  }

  isLastPage(containerWidth: number) {
    // Calculate how many products should be on each page
    let productsPerPage = (containerWidth) / (this.productWidth);

    // Calculate the remaining products based on the current page and how many products per page
    let remainingProducts = this.products.length - (this.currentPage * productsPerPage);

    // See if we are on the last page
    return remainingProducts <= 0;
  }

}
