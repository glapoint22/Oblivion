import { Component, Input, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { DataService, Image, ImageSizeType, LazyLoadingService, MediaType, SpinnerAction, Subproduct } from 'common';
import { TitleCase } from 'text-box';
import { SubproductType } from '../../classes/enums';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';
import { ValuePopupComponent } from '../value-popup/value-popup.component';

@Component({
  selector: 'subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss']
})
export class SubproductsComponent {
  @Input() subproducts!: Array<Subproduct>;
  @Input() subproductType!: SubproductType;
  @Input() productId!: number;
  @ViewChildren('editValuePopupContainer', { read: ViewContainerRef }) editValuePopupContainers!: QueryList<ViewContainerRef>;
  @ViewChildren('addValuePopupContainer', { read: ViewContainerRef }) addValuePopupContainers!: QueryList<ViewContainerRef>;
  public SubproductType = SubproductType;
  private titleCase: TitleCase = new TitleCase();



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



  



  // --------------------------------------------------- Open Value Popup ---------------------------------------------------
  public async openValuePopup(subproduct: Subproduct, index: number, add?: boolean): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { ValuePopupComponent } = await import('../value-popup/value-popup.component');
      const { ValuePopupModule } = await import('../value-popup/value-popup.module');
      return {
        component: ValuePopupComponent,
        module: ValuePopupModule
      }
    }, SpinnerAction.None, add ? this.addValuePopupContainers.toArray()[index] : this.editValuePopupContainers.toArray()[index])
      .then((valuePopup: ValuePopupComponent) => {
        valuePopup.value = subproduct.value;

        valuePopup.callback = (newValue: number) => {
          subproduct.value = newValue;
          this.updateValue(subproduct.id, newValue);
        }
      });
  }





  // ------------------------------------------------------- Update Image ---------------------------------------------------
  updateImage(subproductId: number, imageId: number): void {
    this.dataService.put('api/Products/Subproduct/Image', {
      itemId: subproductId,
      PropertyId: imageId
    }).subscribe();
  }







  // --------------------------------------------------------- Update Value ----------------------------------------------------
  updateValue(subproductId: number, value: number): void {
    this.dataService.put('api/Products/Subproduct/Value', {
      SubproductId: subproductId,
      Value: value
    }).subscribe();
  }







  // ---------------------------------------------------------- On Name Change --------------------------------------------------
  onNameChange(input: HTMLInputElement, subproduct: Subproduct): void {
    const selectionStart = input.selectionStart;

    subproduct.name = input.value = this.titleCase.getCase(input.value);
    input.setSelectionRange(selectionStart, selectionStart);

    this.dataService.put('api/Products/Subproduct/Name', {
      id: subproduct.id,
      name: subproduct.name
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
}