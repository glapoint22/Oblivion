import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockedUsersFormComponent } from './blocked-users-form.component';
import { ListModule } from '../lists/list/list.module';



@NgModule({
  declarations: [BlockedUsersFormComponent],
  imports: [
    CommonModule,
    ListModule
  ]
})
export class BlockedUsersFormModule { }