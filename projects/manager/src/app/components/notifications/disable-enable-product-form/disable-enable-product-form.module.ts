import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableEnableProductFormComponent } from './disable-enable-product-form.component';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { CounterModule } from '../../counter/counter.module';



@NgModule({
  declarations: [DisableEnableProductFormComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CounterModule
  ]
})
export class DisableEnableProductFormModule { }