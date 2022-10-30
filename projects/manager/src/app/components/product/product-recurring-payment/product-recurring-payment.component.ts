import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { SpinnerAction, RecurringPayment, DataService, LazyLoadingService } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { Product } from '../../../classes/product';
import { RecurringPopupComponent } from '../../recurring-popup/recurring-popup.component';

@Component({
  selector: 'product-recurring-payment',
  templateUrl: './product-recurring-payment.component.html',
  styleUrls: ['./product-recurring-payment.component.scss']
})
export class ProductRecurringPaymentComponent {
  private recurringPopup!: RecurringPopupComponent;

  public recurringPopupOpen!: boolean;
  public PopupArrowPosition = PopupArrowPosition;

  @Input() product!: Product;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService) { }

  openRecurringPopup(arrowPosition: PopupArrowPosition) {
    if (this.recurringPopupOpen) {
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
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addRecurringPopup : this.editRecurringPopup)
      .then((recurringPopup: RecurringPopupComponent) => {
        this.recurringPopupOpen = true;
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
          this.recurringPopupOpen = false;
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