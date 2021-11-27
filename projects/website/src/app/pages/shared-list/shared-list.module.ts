import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedListRoutingModule } from './shared-list-routing.module';
import { SharedListComponent } from './shared-list.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { StarsModule } from '../../components/stars/stars.module';
import { DropdownModule } from '../../components/dropdown/dropdown.module';


@NgModule({
  declarations: [SharedListComponent],
  imports: [
    CommonModule,
    SharedListRoutingModule,
    HeaderFooterModule,
    StarsModule,
    DropdownModule
  ]
})
export class SharedListModule { }
