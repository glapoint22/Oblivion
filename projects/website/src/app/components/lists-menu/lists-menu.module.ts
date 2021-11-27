import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListsMenuComponent } from './lists-menu.component';



@NgModule({
  declarations: [ListsMenuComponent],
  imports: [
    CommonModule
  ],
  exports: [ListsMenuComponent]
})
export class ListsMenuModule { }
