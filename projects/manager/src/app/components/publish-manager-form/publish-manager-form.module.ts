import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishManagerFormComponent } from './publish-manager-form.component';
import { PublishListModule } from '../lists/publish-list/publish-list.module';



@NgModule({
  declarations: [PublishManagerFormComponent],
  imports: [
    CommonModule,
    PublishListModule
  ]
})
export class PublishManagerFormModule { }