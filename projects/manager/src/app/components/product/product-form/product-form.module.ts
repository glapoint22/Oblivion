import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form.component';
import { FormsModule } from '@angular/forms';
import { RecurringPaymentModule, ShippingModule } from 'common';
import { ColorSwatchModule } from '../../color-swatch/color-swatch.module';
import { DropdownModule } from '../../dropdown/dropdown.module';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { SubproductsComponent } from '../subproducts/subproducts.component';
import { TextToolbarPopupComponent } from '../../text-toolbar-popup/text-toolbar-popup.component';
import { ProductBonusesComponent } from '../product-bonuses/product-bonuses.component';
import { ProductCircleButtonsComponent } from '../product-circle-buttons/product-circle-buttons.component';
import { ProductComponentsComponent } from '../product-components/product-components.component';
import { DescriptionComponent } from '../product-description/description/description.component';
import { ProductDescriptionComponent } from '../product-description/product-description.component';
import { ProductHoplinkComponent } from '../product-hoplink/product-hoplink.component';
import { ProductMediaDisplayComponent } from '../product-media/product-media-display/product-media-display.component';
import { ProductMediaListComponent } from '../product-media/product-media-list/product-media-list.component';
import { ProductNameComponent } from '../product-name/product-name.component';
import { PricePointHeaderComponent } from '../product-price-points/price-points/price-point/price-point-header/price-point-header.component';
import { PricePointImageComponent } from '../product-price-points/price-points/price-point/price-point-image/price-point-image.component';
import { PricePointPriceComponent } from '../product-price-points/price-points/price-point/price-point-price/price-point-price.component';
import { PricePointQuantityComponent } from '../product-price-points/price-points/price-point/price-point-quantity/price-point-quantity.component';
import { PricePointRecurringPaymentComponent } from '../product-price-points/price-points/price-point/price-point-recurring-payment/price-point-recurring-payment.component';
import { PricePointShippingComponent } from '../product-price-points/price-points/price-point/price-point-shipping/price-point-shipping.component';
import { PricePointStrikethroughPriceComponent } from '../product-price-points/price-points/price-point/price-point-strikethrough-price/price-point-strikethrough-price.component';
import { PricePointUnitPriceComponent } from '../product-price-points/price-points/price-point/price-point-unit-price/price-point-unit-price.component';
import { PricePointUnitComponent } from '../product-price-points/price-points/price-point/price-point-unit/price-point-unit.component';
import { PricePointsComponent } from '../product-price-points/price-points/price-points.component';
import { ProductPricePointsComponent } from '../product-price-points/product-price-points.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductRecurringPaymentComponent } from '../product-recurring-payment/product-recurring-payment.component';
import { ProductShippingComponent } from '../product-shipping/product-shipping.component';
import { CircleButtonComponent } from '../product-circle-buttons/circle-button/circle-button.component';
import { ProductGroupsCircleButtonComponent } from '../product-circle-buttons/product-groups-circle-button/product-groups-circle-button.component';
import { KeywordsCircleButtonComponent } from '../product-circle-buttons/keywords-circle-button/keywords-circle-button.component';
import { FiltersCircleButtonComponent } from '../product-circle-buttons/filters-circle-button/filters-circle-button.component';
import { VendorCircleButtonComponent } from '../product-circle-buttons/vendor-circle-button/vendor-circle-button.component';
import { NotificationCircleButtonComponent } from '../product-circle-buttons/notification-circle-button/notification-circle-button.component';
import { ProductBreadcrumbsComponent } from '../product-breadcrumbs/product-breadcrumbs.component';
import { SubproductImageComponent } from '../subproducts/subproduct-image/subproduct-image.component';
import { SubproductNameComponent } from '../subproducts/subproduct-name/subproduct-name.component';
import { SubproductDescriptionComponent } from '../subproducts/subproduct-description/subproduct-description.component';
import { SubproductValueComponent } from '../subproducts/subproduct-value/subproduct-value.component';



@NgModule({
  declarations: [
    ProductFormComponent,
    ProductCircleButtonsComponent,
    CircleButtonComponent,
    NotificationCircleButtonComponent,
    VendorCircleButtonComponent,
    FiltersCircleButtonComponent,
    KeywordsCircleButtonComponent,
    ProductGroupsCircleButtonComponent,
    ProductBreadcrumbsComponent,
    ProductMediaListComponent,
    ProductMediaDisplayComponent,
    ProductNameComponent,
    ProductPriceComponent,
    ProductShippingComponent,
    ProductRecurringPaymentComponent,
    ProductHoplinkComponent,
    ProductDescriptionComponent,
    DescriptionComponent,
    TextToolbarPopupComponent,
    ProductPricePointsComponent,
    PricePointsComponent,
    PricePointHeaderComponent,
    PricePointQuantityComponent,
    PricePointImageComponent,
    PricePointUnitPriceComponent,
    PricePointUnitComponent,
    PricePointStrikethroughPriceComponent,
    PricePointPriceComponent,
    PricePointShippingComponent,
    PricePointRecurringPaymentComponent,
    ProductComponentsComponent,
    ProductBonusesComponent,
    SubproductsComponent,
    SubproductImageComponent,
    SubproductNameComponent,
    SubproductDescriptionComponent,
    SubproductValueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ColorSwatchModule,
    RecurringPaymentModule,
    ShippingModule,
    IconButtonModule,
    DropdownModule
  ],
  exports: [
    ProductFormComponent
  ]
})
export class ProductFormModule { }
