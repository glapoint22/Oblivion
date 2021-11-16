import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    RouterModule,
    HeaderFooterModule
  ]
})
export class ProfileModule { }
