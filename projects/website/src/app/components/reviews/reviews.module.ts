import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews.component';
import { DropdownModule } from '../dropdown/dropdown.module';
import { StarsModule } from '../stars/stars.module';



@NgModule({
  declarations: [ReviewsComponent],
  imports: [
    CommonModule,
    DropdownModule,
    StarsModule
  ],
  exports: [
    ReviewsComponent
  ]
})
export class ReviewsModule { }
