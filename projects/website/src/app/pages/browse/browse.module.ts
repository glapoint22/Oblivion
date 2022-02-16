import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { PageModule } from 'widgets';


@NgModule({
  declarations: [BrowseComponent],
  imports: [
    CommonModule,
    BrowseRoutingModule,
    HeaderFooterModule,
    PageModule
  ]
})
export class BrowseModule { }
