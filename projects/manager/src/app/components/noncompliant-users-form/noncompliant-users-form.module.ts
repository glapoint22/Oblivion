import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoncompliantUsersFormComponent } from './noncompliant-users-form.component';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [NoncompliantUsersFormComponent],
  imports: [
    CommonModule,
    MultiColumnListModule
  ]
})
export class NoncompliantUsersFormModule { }