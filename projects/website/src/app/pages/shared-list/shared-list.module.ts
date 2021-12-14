import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedListRoutingModule } from './shared-list-routing.module';
import { SharedListComponent } from './shared-list.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { DropdownModule } from '../../components/dropdown/dropdown.module';
import { StarsSummaryModule } from '../../components/stars-summary/stars-summary.module';


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
