import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaBrowserComponent } from './media-browser.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [MediaBrowserComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    FormsModule
  ]
})
export class MediaBrowserModule { }
