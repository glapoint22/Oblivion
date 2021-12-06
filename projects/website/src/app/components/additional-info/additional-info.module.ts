import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalInfoComponent } from './additional-info.component';



@NgModule({
  declarations: [AdditionalInfoComponent],
  imports: [
    CommonModule
  ],
  exports: [AdditionalInfoComponent]
})
export class AdditionalInfoModule { }
