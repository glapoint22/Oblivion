import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkComponent } from './link.component';
import { SearchModule } from '../search/search.module';



@NgModule({
  declarations: [LinkComponent],
  imports: [
    CommonModule,
    SearchModule
  ]
})
export class LinkModule { }
