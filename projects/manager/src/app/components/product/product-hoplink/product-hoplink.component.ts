import { Component} from '@angular/core';
import { SpinnerAction } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { HoplinkPopupComponent } from '../../hoplink-popup/hoplink-popup.component';
import { ProductComponent } from '../product.component';

@Component({
  selector: 'product-hoplink',
  templateUrl: './product-hoplink.component.html',
  styleUrls: ['../product.component.scss', './product-hoplink.component.scss']
})
export class ProductHoplinkComponent extends ProductComponent {
  private hoplinkPopup!: HoplinkPopupComponent;

  openHoplinkPopup(arrowPosition: PopupArrowPosition) {
    if (this.popupOpen) {
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
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addPopupContainer : this.editPopupContainer)
      .then((hoplinkPopup: HoplinkPopupComponent) => {
        this.popupOpen = true;
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
          this.popupOpen = false;
        });
      });
  }
}