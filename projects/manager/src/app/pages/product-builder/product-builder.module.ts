import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductBuilderRoutingModule } from './product-builder-routing.module';
import { ProductBuilderComponent } from './product-builder.component';
import { NichesSideMenuModule } from '../../components/niches-side-menu/niches-side-menu.module';
import { ProductFormModule } from '../../components/product/product-form/product-form.module';
import { DropdownModule } from '../../dropdown/dropdown.module';


@NgModule({
  declarations: [
    ProductBuilderComponent
  ],
  imports: [
    CommonModule,
    ProductBuilderRoutingModule,
    NichesSideMenuModule,
    ProductFormModule,
    DropdownModule
  ]
})
export class ProductBuilderModule { }