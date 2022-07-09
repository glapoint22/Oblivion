import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPageComponent } from './custom-page.component';

const routes: Routes = [
  {
    path: '',
    component: CustomPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPageRoutingModule { }
