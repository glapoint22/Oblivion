import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordsFormComponent } from './keywords-form.component';
import { FormKeywordsModule } from '../form-keywords/form-keywords.module';



@NgModule({
  declarations: [KeywordsFormComponent],
  imports: [
    CommonModule,
    FormKeywordsModule
  ],
  exports: [
    KeywordsFormComponent
  ]
})
export class KeywordsFormModule { }