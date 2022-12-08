import { Component, Input } from '@angular/core';
import { DataService } from 'common';
import { TitleCase } from 'text-box';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'product-name',
  templateUrl: './product-name.component.html',
  styleUrls: ['./product-name.component.scss']
})
export class ProductNameComponent {
  public titleCaseOff!: boolean;
  private titleCase: TitleCase = new TitleCase();

  @Input() product!: Product;

  constructor(private dataService: DataService, private productService: ProductService) { }


  // =====================================================================( ON PASTE )====================================================================== \\

  onPaste(e: ClipboardEvent, htmlElement: HTMLElement) {
    e.preventDefault();
    const clipboardData = e.clipboardData!.getData('text/plain');
    if (clipboardData) {
      htmlElement.innerText = clipboardData;
    }

    // Place cursor at the end of the text
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(htmlElement);
    range.collapse(false);
    sel!.removeAllRanges();
    sel!.addRange(range);
  }



  // ===================================================================( SELECT RANGE )==================================================================== \\

  selectRange(htmlElement: HTMLElement) {
    window.setTimeout(() => {
      let range = document.createRange();
      range.selectNodeContents(htmlElement);
      let sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    })
  }



  // ===================================================================( ON NAME BLUR )==================================================================== \\

  onNameBlur(product: Product, htmlElement: HTMLElement, titleCaseOff: boolean) {
    window.getSelection()!.removeAllRanges();

    if (!(product.name == null && htmlElement.innerText.length == 0) && product.name != htmlElement.innerText) {
      product.name = htmlElement.innerText = !titleCaseOff ? this.titleCase.getCase(htmlElement.innerText) : htmlElement.innerText;
      this.updateName(product);
    }
  }



  // ==================================================================( ON NAME ESCAPE )=================================================================== \\

  onNameEscape(product: Product, htmlElement: HTMLElement) {
    htmlElement.innerText = product.name ? product.name : '';
    htmlElement.blur();
  }



  // ===================================================================( UPDATE NAME )====================================================================== \\

  updateName(product: Product) {
    const listItem = this.productService.sideMenuNicheArray.find(x => x.id == product.id && x.hierarchyGroupID == 2);
    listItem!.name = product.name;

    this.productService.sort(listItem!, this.productService.sideMenuNicheArray);

    this.dataService.put('api/Products', {
      id: product.id,
      name: product.name
    }, {
      authorization: true
    }).subscribe();
  }
}