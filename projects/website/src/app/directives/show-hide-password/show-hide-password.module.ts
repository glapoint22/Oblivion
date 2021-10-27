import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowHidePasswordDirective } from './show-hide-password.directive';



@NgModule({
  declarations: [ShowHidePasswordDirective],
  imports: [
    CommonModule
  ],exports: [ShowHidePasswordDirective]
})
export class ShowHidePasswordModule { }
