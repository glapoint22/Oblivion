import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPropertiesComponent } from './product-properties.component';
import { ProductPricePropertyComponent } from './product-price-property/product-price-property.component';
import { AdditionalInfoPropertiesComponent } from './product-price-property/additional-info-properties/additional-info-properties.component';
import { RecurringPaymentPropertiesComponent } from './product-price-property/additional-info-properties/recurring-payment-properties/recurring-payment-properties.component';
import { ShippingPropertiesComponent } from './product-price-property/additional-info-properties/shipping-properties/shipping-properties.component';
import { PanelComponent } from '../panel/panel.component';
import { CounterComponent } from '../counter/counter.component';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { ProductVendorPropertyComponent } from './product-vendor-property/product-vendor-property.component';
import { ProductHoplinkPropertyComponent } from './product-hoplink-property/product-hoplink-property.component';
import { ProductFiltersPropertyComponent } from './product-filters-property/product-filters-property.component';
import { ProductImagePropertyComponent } from './product-image-property/product-image-property.component';
import { ProductMediaPropertyComponent } from './product-media-property/product-media-property.component';
import { ProductDescriptionPropertyComponent } from './product-description-property/product-description-property.component';
import { ProductSubproductsPropertyComponent } from './product-subproducts-property/product-subproducts-property.component';
import { ProductKeywordsPropertyComponent } from './product-keywords-property/product-keywords-property.component';
import { ProductGroupsPropertyComponent } from './product-groups-property/product-groups-property.component';
import { HierarchyItemModule } from '../hierarchy/hierarchy-item/hierarchy-item.module';


@NgModule({
  declarations: [
    ProductPropertiesComponent,
    ProductPricePropertyComponent,
    AdditionalInfoPropertiesComponent,
    RecurringPaymentPropertiesComponent,
    ShippingPropertiesComponent,
    PanelComponent,
    CounterComponent,
    ImageBoxComponent,
    ProductVendorPropertyComponent,
    ProductHoplinkPropertyComponent,
    ProductFiltersPropertyComponent,
    ProductImagePropertyComponent,
    ProductMediaPropertyComponent,
    ProductDescriptionPropertyComponent,
    ProductSubproductsPropertyComponent,
    ProductKeywordsPropertyComponent,
    ProductGroupsPropertyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ProductPropertiesComponent]
})
export class ProductPropertiesModule { }
