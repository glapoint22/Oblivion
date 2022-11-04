import { Component, Input } from '@angular/core';
import { DataService, LazyLoadingService, Subproduct } from 'common';
import { SubproductType } from '../../../classes/enums';

@Component({
  selector: 'subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss']
})
export class SubproductsComponent {
  public SubproductType = SubproductType;
  @Input() subproducts!: Array<Subproduct>;
  @Input() subproductType!: SubproductType;
  @Input() productId!: number;

  constructor(public dataService: DataService, public lazyLoadingService: LazyLoadingService) { }


  // ==================================================================( ADD SUBPRODUCT )=================================================================== \\

  addSubproduct(): void {
    this.subproducts.push(new Subproduct());

    this.dataService.post<number>('api/Products/Subproduct', {
      productId: this.productId,
      type: this.subproductType
    }).subscribe((id: number) => {
      this.subproducts[this.subproducts.length - 1].id = id;
    });
  }

  

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


  
  // ================================================================( DELETE SUBPRODUCT )================================================================== \\

  deleteSubproduct(index: number, id: number): void {
    this.subproducts.splice(index, 1);

    this.dataService.delete('api/Products/Subproduct', {
      id: id
    }).subscribe();
  }



  // ================================================================( UPDATE SUBPRODUCT )================================================================== \\

  updateSubproduct(subproduct: Subproduct) {
    this.dataService.put('api/Products/Subproduct', {
      id: subproduct.id,
      imageId: subproduct.image.id,
      name: subproduct.name && subproduct.name.length > 0 ? subproduct.name : null,
      Value: subproduct.value && !isNaN(subproduct.value) ? subproduct.value : 0
    }).subscribe();
  }
}