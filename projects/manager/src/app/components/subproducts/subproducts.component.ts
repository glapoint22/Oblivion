import { Component, Input, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { DataService, Image, LazyLoadingService, MediaType, SpinnerAction, Subproduct } from 'common';
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
  @ViewChildren('editValuePopupContainer', { read: ViewContainerRef }) editValuePopupContainers!: QueryList<ViewContainerRef>;
  @ViewChildren('addValuePopupContainer', { read: ViewContainerRef }) addValuePopupContainers!: QueryList<ViewContainerRef>;
  public SubproductType = SubproductType;
  private titleCase: TitleCase = new TitleCase();

  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }

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
        mediaBrowser.currentMediaType = MediaType.Image;



        mediaBrowser.callback = (image: Image) => {
          if (image) {
            subproduct.image.id = image.id;
            subproduct.image.name = image.name;
            subproduct.image.src = image.src;
            subproduct.image.thumbnail = image.thumbnail;

            this.updateImage(subproduct.id, image.id);
          }
        }
      });
  }





  public async openValuePopup(value: number, index: number, add?: boolean): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { ValuePopupComponent } = await import('../value-popup/value-popup.component');
      const { ValuePopupModule } = await import('../value-popup/value-popup.module');
      return {
        component: ValuePopupComponent,
        module: ValuePopupModule
      }
    }, SpinnerAction.None, add ? this.addValuePopupContainers.toArray()[index] : this.editValuePopupContainers.toArray()[index])
      .then((valuePopup: ValuePopupComponent) => {
        valuePopup.value = value;
      });
  }






  updateImage(subproductId: number, imageId: number) {
    this.dataService.put('api/Products/Subproduct/Image', {
      itemId: subproductId,
      PropertyId: imageId
    }).subscribe();
  }



  onNameChange(input: HTMLInputElement, subproduct: Subproduct) {
    const selectionStart = input.selectionStart;

    subproduct.name = input.value = this.titleCase.getCase(input.value);
    input.setSelectionRange(selectionStart, selectionStart);

    this.dataService.put('api/Products/Subproduct/Name', {
      id: subproduct.id,
      name: subproduct.name
    }).subscribe();
  }
}