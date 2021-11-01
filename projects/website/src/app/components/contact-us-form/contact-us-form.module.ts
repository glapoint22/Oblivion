import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsFormComponent } from './contact-us-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ContactUsFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ContactUsFormModule { }
