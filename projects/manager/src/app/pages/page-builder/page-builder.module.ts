import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { PageBuilderComponent } from './page-builder.component';
import { MenuBarModule } from '../../components/menu-bar/menu-bar.module';
import { EditorComponent } from '../../components/editor/editor.component';
import { WidgetInspectorModule } from '../../components/widget-inspector/widget-inspector.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PageBuilderComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    PageBuilderRoutingModule,
    MenuBarModule,
    WidgetInspectorModule,
    FormsModule
  ]
})
export class PageBuilderModule { }
