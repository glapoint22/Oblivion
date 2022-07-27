import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { DataService, LazyLoadingService, PricePoint, RecurringPayment, Shipping, ShippingType, SpinnerAction, Subproduct } from 'common';
import { PopupArrowPosition, SubproductType } from '../../classes/enums';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product/product.service';
import { FiltersPopupComponent } from '../filters-popup/filters-popup.component';
import { HoplinkPopupComponent } from '../hoplink-popup/hoplink-popup.component';
import { KeywordsPopupComponent } from '../keywords-popup/keywords-popup.component';
import { PricePointsComponent } from '../price-points/price-points.component';
import { PricePopupComponent } from '../price-popup/price-popup.component';
import { ProductGroupsPopupComponent } from '../product-groups-popup/product-groups-popup.component';
import { RecurringPopupComponent } from '../recurring-popup/recurring-popup.component';
import { ShippingPopupComponent } from '../shipping-popup/shipping-popup.component';
import { VendorPopupComponent } from '../vendor-popup/vendor-popup.component';

@Component({
  selector: 'product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductPropertiesComponent {
  private vendorPopup!: VendorPopupComponent;
  private filtersPopup!: FiltersPopupComponent;
  private keywordsPopup!: KeywordsPopupComponent;
  private productGroupsPopup!: ProductGroupsPopupComponent;
  private pricePopup!: PricePopupComponent;
  private shippingPopup!: ShippingPopupComponent;
  private recurringPopup!: RecurringPopupComponent;
  private hoplinkPopup!: HoplinkPopupComponent;

  public zIndex!: number;
  public product: Product = new Product();
  public shippingType = ShippingType;
  public PopupArrowPosition = PopupArrowPosition;
  public shipping = Shipping;
  public subproductType = SubproductType;

  public productFiltersHierarchy: Array<HierarchyItem> = new Array<HierarchyItem>();
  public productFiltersSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();

  @ViewChild('pricePoints') pricePoints!: PricePointsComponent;
  @ViewChild('editPricePopup', { read: ViewContainerRef }) editPricePopup!: ViewContainerRef;
  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;
  @ViewChild('addHoplinkPopup', { read: ViewContainerRef }) addHoplinkPopup!: ViewContainerRef;
  @ViewChild('editHoplinkPopup', { read: ViewContainerRef }) editHoplinkPopup!: ViewContainerRef;
  @ViewChild('vendorPopup', { read: ViewContainerRef }) vendorPopupContainer!: ViewContainerRef;
  @ViewChild('filtersPopup', { read: ViewContainerRef }) filtersPopupContainer!: ViewContainerRef;
  @ViewChild('keywordsPopup', { read: ViewContainerRef }) keywordsPopupContainer!: ViewContainerRef;
  @ViewChild('productGroupsPopup', { read: ViewContainerRef }) productGroupsPopupContainer!: ViewContainerRef;


  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService) { }


  openVendorPopup() {
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.vendorPopupContainer.length > 0) {
      this.vendorPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { VendorPopupComponent } = await import('../vendor-popup/vendor-popup.component');
      const { VendorPopupModule } = await import('../vendor-popup/vendor-popup.module');
      return {
        component: VendorPopupComponent,
        module: VendorPopupModule
      }
    }, SpinnerAction.None, this.vendorPopupContainer)
      .then((vendorPopup: VendorPopupComponent) => {
        this.vendorPopup = vendorPopup;
      });
  }





  openFiltersPopup() {
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.filtersPopupContainer.length > 0) {
      this.filtersPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { FiltersPopupComponent } = await import('../filters-popup/filters-popup.component');
      const { FiltersPopupModule } = await import('../filters-popup/filters-popup.module');
      return {
        component: FiltersPopupComponent,
        module: FiltersPopupModule
      }
    }, SpinnerAction.None, this.filtersPopupContainer)
      .then((filtersPopup: FiltersPopupComponent) => {
        this.filtersPopup = filtersPopup;
        this.filtersPopup.productId = this.product.id;
        this.filtersPopup.productIndex = this.productService.productComponents.indexOf(this);
      });
  }



  openKeywordsPopup() {
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.keywordsPopupContainer.length > 0) {
      this.keywordsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { KeywordsPopupComponent } = await import('../keywords-popup/keywords-popup.component');
      const { KeywordsPopupModule } = await import('../keywords-popup/keywords-popup.module');
      return {
        component: KeywordsPopupComponent,
        module: KeywordsPopupModule
      }
    }, SpinnerAction.None, this.keywordsPopupContainer)
      .then((keywordsPopup: KeywordsPopupComponent) => {
        this.keywordsPopup = keywordsPopup;
      });
  }


  openProductGroupsPopup() {
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);

    if (this.productGroupsPopupContainer.length > 0) {
      this.productGroupsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ProductGroupsPopupComponent } = await import('../product-groups-popup/product-groups-popup.component');
      const { ProductGroupsPopupModule } = await import('../product-groups-popup/product-groups-popup.module');
      return {
        component: ProductGroupsPopupComponent,
        module: ProductGroupsPopupModule
      }
    }, SpinnerAction.None, this.productGroupsPopupContainer)
      .then((productGroupsPopup: ProductGroupsPopupComponent) => {
        this.productGroupsPopup = productGroupsPopup;
      });
  }



  openPricePopup() {
    if (this.editPricePopup.length > 0) {
      this.pricePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { PricePopupComponent } = await import('../price-popup/price-popup.component');
      const { PricePopupModule } = await import('../price-popup/price-popup.module');
      return {
        component: PricePopupComponent,
        module: PricePopupModule
      }
    }, SpinnerAction.None, this.editPricePopup)
      .then((pricePopup: PricePopupComponent) => {
        this.pricePopup = pricePopup;
        pricePopup.price = this.product.minPrice;
        pricePopup.productId = this.product.id;
        pricePopup.callback = (price: number) => {
          this.product.minPrice = price;
        }
      });
  }


  openShippingPopup(arrowPosition: PopupArrowPosition) {
    if (this.addShippingPopup.length > 0 || this.editShippingPopup.length > 0) {
      this.shippingPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ShippingPopupComponent } = await import('../shipping-popup/shipping-popup.component');
      const { ShippingPopupModule } = await import('../shipping-popup/shipping-popup.module');
      return {
        component: ShippingPopupComponent,
        module: ShippingPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addShippingPopup : this.editShippingPopup)
      .then((shippingPopup: ShippingPopupComponent) => {
        this.shippingPopup = shippingPopup;
        shippingPopup.arrowPosition = arrowPosition;
        shippingPopup.shipping = arrowPosition == PopupArrowPosition.TopLeft ? ShippingType.FreeShipping : this.product.shippingType;
        shippingPopup.callback = (shippingType: ShippingType) => {
          this.product.shippingType = shippingType;

          // Update the database
          this.updateShipping();

        }
      });
  }


  updateShipping() {
    this.dataService.put('api/Products/Shipping', {
      id: this.product.id,
      shippingType: this.product.shippingType
    }).subscribe();
  }


  openRecurringPopup(arrowPosition: PopupArrowPosition) {
    if (this.addRecurringPopup.length > 0 || this.editRecurringPopup.length > 0) {
      this.recurringPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addRecurringPopup : this.editRecurringPopup)
      .then((recurringPopup: RecurringPopupComponent) => {
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


  openHoplinkPopup(arrowPosition: PopupArrowPosition) {
    if (this.addHoplinkPopup.length > 0 || this.editHoplinkPopup.length > 0) {
      this.hoplinkPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { HoplinkPopupComponent } = await import('../hoplink-popup/hoplink-popup.component');
      const { HoplinkPopupModule } = await import('../hoplink-popup/hoplink-popup.module');
      return {
        component: HoplinkPopupComponent,
        module: HoplinkPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addHoplinkPopup : this.editHoplinkPopup)
      .then((hoplinkPopup: HoplinkPopupComponent) => {
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
      });
  }


  addPricePoints() {
    this.product.pricePoints.push(new PricePoint());

    window.setTimeout(() => {

      if (this.product.minPrice > 0) {
        this.pricePoints.updateMinMaxPrice();
      }

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