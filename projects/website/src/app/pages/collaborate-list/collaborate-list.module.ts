import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaborateListRoutingModule } from './collaborate-list-routing.module';
import { CollaborateListComponent } from './collaborate-list.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';


@NgModule({
  declarations: [CollaborateListComponent],
  imports: [
    CommonModule,
    CollaborateListRoutingModule,
    HeaderFooterModule
  ]
})
export class CollaborateListModule { }
