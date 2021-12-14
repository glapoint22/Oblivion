import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews.component';
import { DropdownModule } from '../dropdown/dropdown.module';
import { StarsModule } from '../stars/stars.module';
import { PaginatorModule } from '../paginator/paginator.module';



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
