import { Component, Input } from '@angular/core';
import { Subproduct } from 'common';
import { TitleCase } from 'text-box';
import { SubproductsComponent } from '../subproducts.component';

@Component({
  selector: 'subproduct-name',
  templateUrl: './subproduct-name.component.html',
  styleUrls: ['./subproduct-name.component.scss']
})
export class SubproductNameComponent extends SubproductsComponent {
  private titleCase: TitleCase = new TitleCase();
  public titleCaseOff!: boolean;
  @Input() subproduct!: Subproduct;


  // ===================================================================( ON NAME BLUR )==================================================================== \\

  onNameBlur(subproduct: Subproduct, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(subproduct.name == null && htmlElement.innerText.length == 0) && subproduct.name != htmlElement.innerText) {
      subproduct.name = htmlElement.innerText = !this.titleCaseOff ? this.titleCase.getCase(htmlElement.innerText) : htmlElement.innerText;
      this.updateSubproduct(subproduct);
    }
  }



  // ==================================================================( ON NAME ESCAPE )=================================================================== \\

  onNameEscape(subproduct: Subproduct, htmlElement: HTMLElement) {
    htmlElement.innerText = subproduct.name ? subproduct.name : '';
    htmlElement.blur();
  }
}