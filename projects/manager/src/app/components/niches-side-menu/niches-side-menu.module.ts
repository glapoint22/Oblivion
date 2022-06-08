import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NichesSideMenuComponent } from './niches-side-menu.component';
import { SideMenuNichesModule } from '../side-menu-niches/side-menu-niches.module';


@NgModule({
  declarations: [NichesSideMenuComponent],
  imports: [
    CommonModule,
    SideMenuNichesModule
  ]
})
export class NichesSideMenuModule { }