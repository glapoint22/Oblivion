import { Component } from '@angular/core';
import { SpinnerAction, RecurringPayment } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { RecurringPopupComponent } from '../../recurring-popup/recurring-popup.component';
import { ProductComponent } from '../product.component';

@Component({
  selector: 'product-recurring-payment',
  templateUrl: './product-recurring-payment.component.html',
  styleUrls: ['../product.component.scss', './product-recurring-payment.component.scss']
})
export class ProductRecurringPaymentComponent extends ProductComponent {
  private recurringPopup!: RecurringPopupComponent;

  openRecurringPopup(arrowPosition: PopupArrowPosition) {
    if (this.popupOpen) {
      this.recurringPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addPopupContainer : this.editPopupContainer)
      .then((recurringPopup: RecurringPopupComponent) => {
        this.popupOpen = true;
        this.recurringPopup = recurringPopup;
        recurringPopup.arrowPosition = arrowPosition;

        if (this.product.recurringPayment) {
          recurringPopup.recurringPayment.recurringPrice = this.product.recurringPayment.recurringPrice;
          recurringPopup.recurringPayment.rebillFrequency = this.product.recurringPayment.rebillFrequency;
          recurringPopup.recurringPayment.subscriptionDuration = this.product.recurringPayment.subscriptionDuration;
          recurringPopup.recurringPayment.timeFrameBetweenRebill = this.product.recurringPayment.timeFrameBetweenRebill;
          recurringPopup.recurringPayment.trialPeriod = this.product.recurringPayment.trialPeriod;
        }

        recurringPopup.callback = (recurringPayment: RecurringPayment) => {
          this.product.recurringPayment = recurringPayment;

          if (this.product.recurringPayment.recurringPrice == 0) {
            this.removeRecurringPayment();
          } else {
            this.updateRecurringPayment();
          }
        }

        const onRecurringPopupCloseListener = this.recurringPopup.onClose.subscribe(() => {
          onRecurringPopupCloseListener.unsubscribe();
          this.popupOpen = false;
        });
      });
  }


  updateRecurringPayment() {
    this.dataService.put('api/Products/RecurringPayment', {
      id: this.product.id,
      recurringPayment: this.product.recurringPayment
    }).subscribe();
  }


  removeRecurringPayment() {
    this.product.recurringPayment.rebillFrequency = 0;
    this.product.recurringPayment.recurringPrice = 0;
    this.product.recurringPayment.subscriptionDuration = 0;
    this.product.recurringPayment.timeFrameBetweenRebill = 0;
    this.product.recurringPayment.trialPeriod = 0;
    this.updateRecurringPayment();
  }
}