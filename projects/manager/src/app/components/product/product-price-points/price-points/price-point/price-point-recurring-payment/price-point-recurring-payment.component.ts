import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { PricePoint, RecurringPayment, SpinnerAction } from 'common';
import { PopupArrowPosition } from 'projects/manager/src/app/classes/enums';
import { RecurringPopupComponent } from 'projects/manager/src/app/components/recurring-popup/recurring-popup.component';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-recurring-payment',
  templateUrl: './price-point-recurring-payment.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-recurring-payment.component.scss']
})
export class PricePointRecurringPaymentComponent extends PricePointComponent {
  private recurringPopup!: RecurringPopupComponent;

  public recurringPayment = RecurringPayment;
  public recurringPopupOpen!: boolean;


  @Input() pricePoint!: PricePoint;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;
  



  
  openRecurringPopup(pricePoint: PricePoint, arrowPosition: PopupArrowPosition) {
    if (this.recurringPopupOpen) {
      this.recurringPopup.close();
      return;
    }


    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../../../../../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../../../../../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }

    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.BottomLeft ? this.addRecurringPopup : this.editRecurringPopup)
      .then((recurringPopup: RecurringPopupComponent) => {
        this.recurringPopupOpen = true;
        this.recurringPopup = recurringPopup;
        recurringPopup.arrowPosition = arrowPosition;

        if (pricePoint.recurringPayment) {
          recurringPopup.recurringPayment.recurringPrice = pricePoint.recurringPayment.recurringPrice;
          recurringPopup.recurringPayment.rebillFrequency = pricePoint.recurringPayment.rebillFrequency;
          recurringPopup.recurringPayment.subscriptionDuration = pricePoint.recurringPayment.subscriptionDuration;
          recurringPopup.recurringPayment.timeFrameBetweenRebill = pricePoint.recurringPayment.timeFrameBetweenRebill;
          recurringPopup.recurringPayment.trialPeriod = pricePoint.recurringPayment.trialPeriod;
        }

        recurringPopup.callback = (recurringPayment: RecurringPayment) => {
          pricePoint.recurringPayment = recurringPayment;

          if (pricePoint.recurringPayment.recurringPrice == 0) {
            this.removeRecurringPayment(pricePoint);
          } else {
            this.updatePricePoint(pricePoint);
          }
        }

        const onRecurringPopupCloseListener = this.recurringPopup.onClose.subscribe(() => {
          onRecurringPopupCloseListener.unsubscribe();
          this.recurringPopupOpen = false;
        });
      });
  }


  removeRecurringPayment(pricePoint: PricePoint) {
    pricePoint.recurringPayment.rebillFrequency = 0;
    pricePoint.recurringPayment.recurringPrice = 0;
    pricePoint.recurringPayment.subscriptionDuration = 0;
    pricePoint.recurringPayment.timeFrameBetweenRebill = 0;
    pricePoint.recurringPayment.trialPeriod = 0;
    this.updatePricePoint(pricePoint);
  }
}