import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { PageModule } from 'widgets';


@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    HeaderFooterModule,
    PageModule
  ]
})
export class SearchModule { }
