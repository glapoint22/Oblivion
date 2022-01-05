import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { MediaPlayerModule } from '../../components/media-player/media-player.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HeaderFooterModule
  ]
})
export class HomeModule { }
