import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderComponent } from './builder.component';



@NgModule({
  declarations: [BuilderComponent],
  imports: [
    CommonModule
  ],
  exports: [BuilderComponent]
})
export class BuilderModule { }
