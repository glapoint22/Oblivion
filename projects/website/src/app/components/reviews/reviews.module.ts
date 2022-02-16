import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews.component';
import { DropdownModule, PaginatorModule, StarsModule } from 'common';



@NgModule({
  declarations: [ReviewsComponent],
  imports: [
    CommonModule,
    DropdownModule,
    StarsModule,
    PaginatorModule
  ],
  exports: [
    ReviewsComponent
  ]
})
export class ReviewsModule { }
