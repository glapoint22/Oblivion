import { Component, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { HierarchyItem } from '../../../classes/hierarchy-item';
import { MultiColumnItem } from '../../../classes/multi-column-item';
import { DataService, LazyLoadingService, PricePoint, Shipping, SpinnerAction, Subproduct } from 'common';
import { PopupArrowPosition, SubproductType } from '../../../classes/enums';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product/product.service';
import { FiltersPopupComponent } from '../../filters-popup/filters-popup.component';
import { KeywordsPopupComponent } from '../../keywords-popup/keywords-popup.component';
import { PricePointsComponent } from '../price-points/price-points.component';
import { ProductGroupsPopupComponent } from '../../product-groups-popup/product-groups-popup.component';
import { VendorPopupComponent } from '../../vendor-popup/vendor-popup.component';
import { CheckboxMultiColumnItem } from '../../../classes/checkbox-multi-column-item';
import { CheckboxItem } from '../../../classes/checkbox-item';
import { KeywordCheckboxItem } from '../../../classes/keyword-checkbox-item';
import { KeywordCheckboxMultiColumnItem } from '../../../classes/keyword-checkbox-multi-column-item';
import { ProductNotificationPopupComponent } from '../../notifications/product-notification-popup/product-notification-popup.component';
import { NotificationItem } from '../../../classes/notifications/notification-item';

@Component({
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  private notificationPopup!: ProductNotificationPopupComponent;
  private filtersPopup!: FiltersPopupComponent;
  private keywordsPopup!: KeywordsPopupComponent;
  private productGroupsPopup!: ProductGroupsPopupComponent;
  
  
  
  
  
  


  
  public viewRef!: ViewRef;
  public vendorPopup!: VendorPopupComponent;
  public zIndex!: number;
  public product: Product = new Product();
  
  public PopupArrowPosition = PopupArrowPosition;
  public shipping = Shipping;
  public subproductType = SubproductType;
  public productFilterArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public productFilterSearchArray: Array<CheckboxMultiColumnItem> = new Array<CheckboxMultiColumnItem>();
  public availableKeywordArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public availableKeywordSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public selectedKeywordArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public selectedKeywordSearchArray: Array<KeywordCheckboxMultiColumnItem> = new Array<KeywordCheckboxMultiColumnItem>();
  public productProductGroupArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public productProductGroupSearchArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  
  
  
  
  
  
  
  


  @ViewChild('pricePoints') pricePoints!: PricePointsComponent;
  
  
  
  
  
  @ViewChild('notificationPopup', { read: ViewContainerRef }) notificationPopupContainer!: ViewContainerRef;
  @ViewChild('vendorPopup', { read: ViewContainerRef }) vendorPopupContainer!: ViewContainerRef;
  @ViewChild('filtersPopup', { read: ViewContainerRef }) filtersPopupContainer!: ViewContainerRef;
  @ViewChild('keywordsPopup', { read: ViewContainerRef }) keywordsPopupContainer!: ViewContainerRef;
  @ViewChild('productGroupsPopup', { read: ViewContainerRef }) productGroupsPopupContainer!: ViewContainerRef;
  


  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService) { }

  


  openNotificationPopup(notificationItem?: NotificationItem) {
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    // If the popup is already open
    if (this.notificationPopupContainer.length > 0) {
      // And it's being opened again from the notification list
      if (notificationItem) {
        // Keep it open and select the notification type in the dropdown that's the same as
        // notification type of the notification that was just selected in the notification list
        this.notificationPopup.selectNotificationType(notificationItem, true);

        // But if the circle button is being clicked
      } else {
        // Just close the popup
        this.notificationPopup.close();
      }
      return;
    }



    this.lazyLoadingService.load(async () => {
      const { ProductNotificationPopupComponent } = await import('../../notifications/product-notification-popup/product-notification-popup.component');
      const { ProductNotificationPopupModule } = await import('../../notifications/product-notification-popup/product-notification-popup.module');
      return {
        component: ProductNotificationPopupComponent,
        module: ProductNotificationPopupModule
      }
    }, SpinnerAction.None, this.notificationPopupContainer)
      .then((notificationPopup: ProductNotificationPopupComponent) => {
        this.notificationPopup = notificationPopup;
        notificationPopup.fromProduct = true;
        // If this popup is being opened from the notification list
        if (notificationItem) notificationPopup.notificationItem = notificationItem!;
        notificationPopup.notificationItems = this.product.notificationItems;
      });
  }


  openVendorPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.vendorPopupContainer.length > 0) {
      this.vendorPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { VendorPopupComponent } = await import('../../vendor-popup/vendor-popup.component');
      const { VendorPopupModule } = await import('../../vendor-popup/vendor-popup.module');
      return {
        component: VendorPopupComponent,
        module: VendorPopupModule
      }
    }, SpinnerAction.None, this.vendorPopupContainer)
      .then((vendorPopup: VendorPopupComponent) => {
        this.vendorPopup = vendorPopup;
        vendorPopup.product = this.product
      });
  }





  openFiltersPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.filtersPopupContainer.length > 0) {
      this.filtersPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { FiltersPopupComponent } = await import('../../filters-popup/filters-popup.component');
      const { FiltersPopupModule } = await import('../../filters-popup/filters-popup.module');
      return {
        component: FiltersPopupComponent,
        module: FiltersPopupModule
      }
    }, SpinnerAction.None, this.filtersPopupContainer)
      .then((filtersPopup: FiltersPopupComponent) => {
        this.filtersPopup = filtersPopup;
        filtersPopup.productId = this.product.id;
        filtersPopup.productIndex = this.productService.products.indexOf(this);
      });
  }



  openKeywordsPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.keywordsPopupContainer.length > 0) {
      this.keywordsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { KeywordsPopupComponent } = await import('../../keywords-popup/keywords-popup.component');
      const { KeywordsPopupModule } = await import('../../keywords-popup/keywords-popup.module');
      return {
        component: KeywordsPopupComponent,
        module: KeywordsPopupModule
      }
    }, SpinnerAction.None, this.keywordsPopupContainer)
      .then((keywordsPopup: KeywordsPopupComponent) => {
        this.keywordsPopup = keywordsPopup;
        keywordsPopup.productId = this.product.id;
        keywordsPopup.productIndex = this.productService.products.indexOf(this);
      });
  }


  openProductGroupsPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);

    if (this.productGroupsPopupContainer.length > 0) {
      this.productGroupsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ProductGroupsPopupComponent } = await import('../../product-groups-popup/product-groups-popup.component');
      const { ProductGroupsPopupModule } = await import('../../product-groups-popup/product-groups-popup.module');
      return {
        component: ProductGroupsPopupComponent,
        module: ProductGroupsPopupModule
      }
    }, SpinnerAction.None, this.productGroupsPopupContainer)
      .then((productGroupsPopup: ProductGroupsPopupComponent) => {
        this.productGroupsPopup = productGroupsPopup;
        productGroupsPopup.productId = this.product.id;
        productGroupsPopup.productIndex = this.productService.products.indexOf(this);
      });
  }




  











  


  


  


  


  


  addPricePoint() {
    // If the product currently has a single price
    if (this.product.minPrice != null) {
      // Remove that single price from the database
      this.dataService.delete('api/Products/Price', { productId: this.product.id }).subscribe();
    }

    // Add a price point to the product
    this.product.pricePoints.push(new PricePoint());

    // Wait a frame so that the pricepoints component can be referenced
    window.setTimeout(() => {
      // Create the price point range
      this.pricePoints.updateMinMaxPrice();
      // Add the price point to the database
      this.pricePoints.addPricePoint();
    })
  }


  addSubproduct(type: SubproductType) {
    let subproduct: Subproduct;

    if (type == SubproductType.Component) {
      this.product.components = [];
      this.product.components.push(new Subproduct());
      subproduct = this.product.components[0];
    } else {
      this.product.bonuses = [];
      this.product.bonuses.push(new Subproduct());
      subproduct = this.product.bonuses[0];
    }



    this.dataService.post<number>('api/Products/Subproduct', {
      productId: this.product.id,
      type: type
    }).subscribe((id: number) => {
      subproduct.id = id;
    });
  }


  


  







  



 





  
}