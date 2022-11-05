import { Component, ViewChild, ViewRef } from '@angular/core';
import { HierarchyItem } from '../../../classes/hierarchy-item';
import { MultiColumnItem } from '../../../classes/multi-column-item';
import { Product } from '../../../classes/product';
import { CheckboxMultiColumnItem } from '../../../classes/checkbox-multi-column-item';
import { CheckboxItem } from '../../../classes/checkbox-item';
import { KeywordCheckboxItem } from '../../../classes/keyword-checkbox-item';
import { KeywordCheckboxMultiColumnItem } from '../../../classes/keyword-checkbox-multi-column-item';
import { ProductMedia } from '../../../classes/product-media';
import { ProductCircleButtonsComponent } from '../product-circle-buttons/product-circle-buttons.component';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  private onCircleButtonsLoad: Subject<void> = new Subject<void>();
  public zIndex!: number;
  public viewRef!: ViewRef;
  public product: Product = new Product();
  public selectedProductMedia!: ProductMedia;
  public productFilterArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public availableKeywordArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public productProductGroupArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public productProductGroupSearchArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public availableKeywordSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public selectedKeywordArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public productFilterSearchArray: Array<CheckboxMultiColumnItem> = new Array<CheckboxMultiColumnItem>();
  public selectedKeywordSearchArray: Array<KeywordCheckboxMultiColumnItem> = new Array<KeywordCheckboxMultiColumnItem>();
  @ViewChild('circleButtons') circleButtons!: ProductCircleButtonsComponent;


  // ================================================================( NG AFTER VIEW INIT )================================================================= \\

  ngAfterViewInit() {
    this.onCircleButtonsLoad.next();
  }



  // =============================================================( OPEN NOTIFICATION POPUP )=============================================================== \\

  openNotificationPopup(notificationItem: NotificationItem) {
    // If the circle buttons have (NOT) been loaded yet in the view at the time this method gets called
    if (!this.circleButtons) {

      // Wait for the view to finish initializing and then call the method on the circle buttons component
      const onCircleButtonsLoadListener = this.onCircleButtonsLoad.subscribe(() => {
        onCircleButtonsLoadListener.unsubscribe();
        this.circleButtons.openNotificationPopup(notificationItem);
      });

      // But if the circle buttons are (ALREADY) loaded in the view at the time this method gets called
    } else {
      // Call the method on the circle buttons component
      this.circleButtons.openNotificationPopup(notificationItem);
    }
  }
}