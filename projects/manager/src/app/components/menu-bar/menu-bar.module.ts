import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from './menu-bar.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MenuBarComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MenuBarComponent]
})
export class MenuBarModule { }
