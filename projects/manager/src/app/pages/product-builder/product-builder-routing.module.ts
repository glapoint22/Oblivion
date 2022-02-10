import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductBuilderComponent } from './product-builder.component';

const routes: Routes = [
  {
    path: '',
    component: ProductBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductBuilderRoutingModule { }
