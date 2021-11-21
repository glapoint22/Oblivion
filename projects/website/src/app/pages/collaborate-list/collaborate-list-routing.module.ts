import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollaborateListComponent } from './collaborate-list.component';

const routes: Routes = [
  {
    path: '',
    component: CollaborateListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaborateListRoutingModule { }
