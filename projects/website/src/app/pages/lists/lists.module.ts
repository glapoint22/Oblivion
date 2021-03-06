import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListsRoutingModule } from './lists-routing.module';
import { ListsComponent } from './lists.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { DropdownButtonComponent } from '../../components/dropdown-button/dropdown-button.component';
import { ListsMenuModule } from '../../components/lists-menu/lists-menu.module';
import { DropdownModule, StarsSummaryModule } from 'common';


@NgModule({
  declarations: [
    ListsComponent,
    DropdownButtonComponent
  ],
  imports: [
    CommonModule,
    ListsRoutingModule,
    HeaderFooterModule,
    StarsSummaryModule,
    DropdownModule,
    ListsMenuModule
  ]
})
export class ListsModule { }
