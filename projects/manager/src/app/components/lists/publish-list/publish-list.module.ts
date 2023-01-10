import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishListComponent } from './publish-list.component';
import { PublishItemComponent } from '../../items/publish-item/publish-item.component';



@NgModule({
  declarations: [PublishListComponent, PublishItemComponent],
  imports: [
    CommonModule
  ],
  exports: [PublishListComponent]
})
export class PublishListModule { }