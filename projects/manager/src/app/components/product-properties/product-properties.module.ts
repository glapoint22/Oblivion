import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPropertiesComponent } from './product-properties.component';
import { ProductPricePropertyComponent } from './product-price-property/product-price-property.component';
import { AdditionalInfoPropertiesComponent } from './product-price-property/additional-info-properties/additional-info-properties.component';
import { RecurringPaymentPropertiesComponent } from './product-price-property/additional-info-properties/recurring-payment-properties/recurring-payment-properties.component';
import { ShippingPropertiesComponent } from './product-price-property/additional-info-properties/shipping-properties/shipping-properties.component';
import { ProductVendorPropertyComponent } from './product-vendor-property/product-vendor-property.component';
import { ProductHoplinkPropertyComponent } from './product-hoplink-property/product-hoplink-property.component';
import { ProductFiltersPropertyComponent } from './product-filters-property/product-filters-property.component';
import { ProductImagePropertyComponent } from './product-image-property/product-image-property.component';
import { ProductMediaPropertyComponent } from './product-media-property/product-media-property.component';
import { ProductDescriptionPropertyComponent } from './product-description-property/product-description-property.component';
import { ProductSubproductsPropertyComponent } from './product-subproducts-property/product-subproducts-property.component';
import { ProductKeywordsPropertyComponent } from './product-keywords-property/product-keywords-property.component';
import { ProductGroupsPropertyComponent } from './product-groups-property/product-groups-property.component';
import { PanelModule } from '../panel/panel.module';
import { ImageBoxModule } from '../image-box/image-box.module';
import { CheckboxListModule } from '../lists/checkbox-list/checkbox-list.module';
import { HierarchyListModule } from '../lists/hierarchy-list/hierarchy-list.module';
import { ListModule } from '../lists/list/list.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';
import { CheckboxHierarchyModule } from '../hierarchies/checkbox-hierarchy/checkbox-hierarchy.module';
import { CounterModule } from '../counter/counter.module';
import { CheckboxMultiColumnListModule } from '../lists/checkbox-multi-column-list/checkbox-multi-column-list.module';
import { AvailableKeywordsModule } from '../available-keywords/available-keywords.module';
import { SelectedKeywordsModule } from '../selected-keywords/selected-keywords.module';


@NgModule({
  declarations: [
    ProductPropertiesComponent,
    ProductPricePropertyComponent,
    AdditionalInfoPropertiesComponent,
    RecurringPaymentPropertiesComponent,
    ShippingPropertiesComponent,
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
    CommonModule,
    PanelModule,
    ImageBoxModule,
    ListModule,
    CheckboxListModule,
    HierarchyListModule,
    IconButtonModule,
    HierarchyModule,
    MultiColumnListModule,
    CheckboxHierarchyModule,
    CounterModule,
    CheckboxMultiColumnListModule,
    AvailableKeywordsModule,
    SelectedKeywordsModule
  ],
  exports: [ProductPropertiesComponent]
})
export class ProductPropertiesModule { }
