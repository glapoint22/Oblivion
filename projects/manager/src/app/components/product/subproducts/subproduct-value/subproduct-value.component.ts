import { Component, Input } from '@angular/core';
import { Subproduct } from 'common';
import { SubproductsComponent } from '../subproducts.component';

@Component({
  selector: 'subproduct-value',
  templateUrl: './subproduct-value.component.html',
  styleUrls: ['./subproduct-value.component.scss']
})
export class SubproductValueComponent extends SubproductsComponent {
  @Input() subproduct!: Subproduct;


  // ==================================================================( ON VALUE INPUT )=================================================================== \\

  onValueInput(htmlElement: HTMLElement) {
    !(/^[0-9.]*$/i).test(htmlElement.innerText) ? htmlElement.innerText = htmlElement.innerText.replace(/[^0-9.]/ig, '') : null;
  }



  // ==================================================================( ON VALUE BLUR )==================================================================== \\

  onValueBlur(subproduct: Subproduct, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(subproduct.value == null && htmlElement.innerText.length == 0) && subproduct.value != parseInt(htmlElement.innerText)) {
      subproduct.value = parseInt(htmlElement.innerText);
      this.updateSubproduct(subproduct);
    }
  }


  // =================================================================( ON VALUE ESCAPE )=================================================================== \\

  onValueEscape(subproduct: Subproduct, htmlElement: HTMLElement) {
    htmlElement.innerText = subproduct.value ? subproduct.value.toString() : '';
    htmlElement.blur();
  }
}