import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedListRoutingModule } from './shared-list-routing.module';
import { SharedListComponent } from './shared-list.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { DropdownModule, StarsSummaryModule } from 'common';


@NgModule({
  declarations: [SharedListComponent],
  imports: [
    CommonModule,
    SharedListRoutingModule,
    HeaderFooterModule,
    StarsSummaryModule,
    DropdownModule
  ]
})
export class SharedListModule { }
