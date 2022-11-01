import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordsPopupComponent } from './keywords-popup.component';
import { AvailableKeywordsModule } from '../../../../available-keywords/available-keywords.module';
import { SelectedKeywordsModule } from '../../../../selected-keywords/selected-keywords.module';
import { IconButtonModule } from '../../../../icon-button/icon-button.module';



@NgModule({
  declarations: [KeywordsPopupComponent],
  imports: [
    CommonModule,
    AvailableKeywordsModule,
    SelectedKeywordsModule,
    IconButtonModule
  ],
  exports: [
    KeywordsPopupComponent
  ]
})
export class KeywordsPopupModule { }
