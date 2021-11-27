import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListsSideMenuComponent } from './lists-side-menu.component';
import { ListsMenuModule } from '../lists-menu/lists-menu.module';



@NgModule({
  declarations: [ListsSideMenuComponent],
  imports: [
    CommonModule,
    ListsMenuModule
  ]
})
export class ListsSideMenuModule { }
