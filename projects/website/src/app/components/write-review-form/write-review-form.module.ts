import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WriteReviewFormComponent } from './write-review-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [WriteReviewFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class WriteReviewFormModule { }
