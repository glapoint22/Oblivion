import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from './menu-bar.component';
import { RouterModule } from '@angular/router';
import { IconButtonModule } from '../icon-button/icon-button.module';



@NgModule({
  declarations: [MenuBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    IconButtonModule
  ],
  exports: [MenuBarComponent]
})
export class MenuBarModule { }
