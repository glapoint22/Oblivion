import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { GridWidgetModule } from '../../components/grid-widget/grid-widget.module';


@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    HeaderFooterModule,
    GridWidgetModule
  ]
})
export class SearchModule { }
