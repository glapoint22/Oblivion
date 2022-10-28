import { Component, Input } from '@angular/core';
import { DataService, Image, ImageSizeType, LazyLoadingService, MediaType, SpinnerAction, Subproduct } from 'common';
import { TitleCase } from 'text-box';
import { SubproductType } from '../../classes/enums';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss']
})
export class SubproductsComponent {
  private titleCase: TitleCase = new TitleCase();
  public titleCaseOff: Array<boolean> = new Array<boolean>();


  public SubproductType = SubproductType;

  @Input() subproducts!: Array<Subproduct>;
  @Input() subproductType!: SubproductType;
  @Input() productId!: number;






  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }



  // --------------------------------------------------- Open Media Browser ---------------------------------------------------
  public async openMediaBrowser(subproduct: Subproduct): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        // Initialize the media browser
        mediaBrowser.init(MediaType.Image, subproduct.image, ImageSizeType.Small, subproduct.name);

        // Callback
        mediaBrowser.callback = (image: Image) => {
          if (image) {
            subproduct.image.id = image.id;
            subproduct.image.name = image.name;
            subproduct.image.src = image.src;

            this.updateImage(subproduct.id, image.id);
          }
        }
      });
  }




  // --------------------------------------------------- Remove Product Image ---------------------------------------------------
  public removeImage(subproduct: Subproduct) {
    // Remove the image
    this.dataService.delete('api/Products/Subproduct/Image', { subproductId: subproduct.id }).subscribe();
    subproduct.image.src = null!;
  }










  // ------------------------------------------------------- Update Image ---------------------------------------------------
  updateImage(subproductId: number, imageId: number): void {
    this.dataService.put('api/Products/Subproduct/Image', {
      itemId: subproductId,
      PropertyId: imageId
    }).subscribe();
  }







  // --------------------------------------------------------- Update Value ----------------------------------------------------
  updateValue(subproduct: Subproduct): void {


    this.dataService.put('api/Products/Subproduct/Value', {
      SubproductId: subproduct.id,
      Value: subproduct.value && isNaN(subproduct.value) ? subproduct.value : 0
    }).subscribe();
  }





  updateName(subproduct: Subproduct) {
    this.dataService.put('api/Products/Subproduct/Name', {
      id: subproduct.id,
      name: subproduct.name && subproduct.name.length > 0 ? subproduct.name : null,
    }).subscribe();
  }









  // ------------------------------------------------------------ Add Subproduct ---------------------------------------------------
  addSubproduct(): void {
    this.subproducts.push(new Subproduct());

    this.dataService.post<number>('api/Products/Subproduct', {
      productId: this.productId,
      type: this.subproductType
    }).subscribe((id: number) => {
      this.subproducts[this.subproducts.length - 1].id = id;
    });
  }






  // ------------------------------------------------------------ Delete Subproduct ---------------------------------------------------
  deleteSubproduct(index: number, id: number): void {
    this.subproducts.splice(index, 1);

    this.dataService.delete('api/Products/Subproduct', {
      id: id
    }).subscribe();
  }








  selectRange(htmlElement: HTMLElement) {
    window.setTimeout(() => {
      let range = document.createRange();
      range.selectNodeContents(htmlElement);
      let sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    })
  }



  onNameBlur(subproduct: Subproduct, htmlElement: HTMLElement, titleCaseOff: boolean) {
    window.getSelection()!.removeAllRanges();

    if (!(subproduct.name == null && htmlElement.innerText.length == 0) && subproduct.name != htmlElement.innerText) {
      subproduct.name = htmlElement.innerText = !titleCaseOff ? this.titleCase.getCase(htmlElement.innerText) : htmlElement.innerText;
      this.updateName(subproduct);
    }
  }


  onNameEscape(subproduct: Subproduct, htmlElement: HTMLElement) {
    htmlElement.innerText = subproduct.name ? subproduct.name : '';
    htmlElement.blur();
  }








  onValueBlur(subproduct: Subproduct, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(subproduct.value == null && htmlElement.innerText.length == 0) && subproduct.value != parseInt(htmlElement.innerText)) {
      subproduct.value = parseInt(htmlElement.innerText);
      this.updateValue(subproduct);
    }
  }


  onValueEscape(subproduct: Subproduct, htmlElement: HTMLElement) {
    htmlElement.innerText = subproduct.value ? subproduct.value.toString() : '';
    htmlElement.blur();
  }












  onPaste(e: ClipboardEvent, htmlElement: HTMLElement, isPrice?: boolean) {
    e.preventDefault();
    const clipboardData = e.clipboardData!.getData('text/plain');
    if (clipboardData) {
      htmlElement.innerText = clipboardData;
    }

    if (isPrice) !(/^[0-9.]*$/i).test(htmlElement.innerText) ? htmlElement.innerText = htmlElement.innerText.replace(/[^0-9.]/ig, '') : null;

    // Place cursor at the end of the text
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(htmlElement);
    range.collapse(false);
    sel!.removeAllRanges();
    sel!.addRange(range);
  }
}