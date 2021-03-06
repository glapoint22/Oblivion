import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductBuilderRoutingModule } from './product-builder-routing.module';
import { ProductBuilderComponent } from './product-builder.component';
import { MenuBarModule } from '../../components/menu-bar/menu-bar.module';
import { NichesSideMenuModule } from '../../components/niches-side-menu/niches-side-menu.module';
import { ProductPropertiesModule } from '../../components/product-properties/product-properties.module';


@NgModule({
  declarations: [
    ProductBuilderComponent
  ],
  imports: [
    CommonModule,
    ProductBuilderRoutingModule,
    NichesSideMenuModule,
    MenuBarModule,
    ProductPropertiesModule
  ]
})
export class ProductBuilderModule { }