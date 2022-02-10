import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailBuilderComponent } from './email-builder.component';

const routes: Routes = [
  {
    path: '',
    component: EmailBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailBuilderRoutingModule { }
