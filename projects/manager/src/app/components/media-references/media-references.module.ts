import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';
import { MediaReferencesComponent } from './media-references.component';



@NgModule({
  declarations: [MediaReferencesComponent],
  imports: [
    CommonModule,
    MultiColumnListModule
  ],
  exports: [MediaReferencesComponent]
})
export class MediaReferencesModule { }
