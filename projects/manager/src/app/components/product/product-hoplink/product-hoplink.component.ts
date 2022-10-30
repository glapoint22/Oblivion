import { Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { Product } from '../../../classes/product';
import { HoplinkPopupComponent } from '../../hoplink-popup/hoplink-popup.component';

@Component({
  selector: 'product-hoplink',
  templateUrl: './product-hoplink.component.html',
  styleUrls: ['./product-hoplink.component.scss']
})
export class ProductHoplinkComponent {
  private hoplinkPopup!: HoplinkPopupComponent;

  public hoplinkPopupOpen!: boolean;
  public PopupArrowPosition = PopupArrowPosition;


  @Input() product!: Product;
  @ViewChild('addHoplinkPopup', { read: ViewContainerRef }) addHoplinkPopup!: ViewContainerRef;
  @ViewChild('editHoplinkPopup', { read: ViewContainerRef }) editHoplinkPopup!: ViewContainerRef;

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService) { }

 
  openHoplinkPopup(arrowPosition: PopupArrowPosition) {
    if (this.hoplinkPopupOpen) {
      this.hoplinkPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { HoplinkPopupComponent } = await import('../../hoplink-popup/hoplink-popup.component');
      const { HoplinkPopupModule } = await import('../../hoplink-popup/hoplink-popup.module');
      return {
        component: HoplinkPopupComponent,
        module: HoplinkPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addHoplinkPopup : this.editHoplinkPopup)
      .then((hoplinkPopup: HoplinkPopupComponent) => {
        this.hoplinkPopupOpen = true;
        this.hoplinkPopup = hoplinkPopup;
        hoplinkPopup.arrowPosition = arrowPosition;
        hoplinkPopup.hoplink = this.product.hoplink;
        hoplinkPopup.callback = (hoplink: string) => {
          this.product.hoplink = hoplink;

          this.dataService.put('api/Products/Hoplink', {
            id: this.product.id,
            hoplink: this.product.hoplink
          }).subscribe();
        }


        const onHoplinkPopupCloseListener = this.hoplinkPopup.onClose.subscribe(() => {
          onHoplinkPopupCloseListener.unsubscribe();
          this.hoplinkPopupOpen = false;
        });
      });
  }
}
