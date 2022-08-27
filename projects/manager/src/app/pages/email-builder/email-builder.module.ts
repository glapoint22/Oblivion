import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailBuilderRoutingModule } from './email-builder-routing.module';
import { EmailBuilderComponent } from './email-builder.component';
import { EmailEditorComponent } from '../../components/email-editor/email-editor.component';
import { EmailInspectorComponent } from '../../components/email-inspector/email-inspector.component';
import { PropertiesModule } from '../../components/properties/properties.module';
import { IconButtonModule } from '../../components/icon-button/icon-button.module';
import { SearchModule } from '../../components/search/search.module';
import { EmailPropertiesComponent } from '../../components/email-properties/email-properties.component';
import { DropdownModule } from '../../components/dropdown/dropdown.module';
import { EmailRowPropertiesComponent } from '../../components/email-row-properties/email-row-properties.component';
import { PaddingComponent } from '../../components/padding/padding.component';
import { PanelModule } from '../../components/panel/panel.module';
import { VerticalAlignmentComponent } from '../../components/vertical-alignment/vertical-alignment.component';
import { EmailColumnPropertiesComponent } from '../../components/email-column-properties/email-column-properties.component';
import { HorizontalAlignmentComponent } from '../../components/horizontal-alignment/horizontal-alignment.component';
import { EmailWidgetPropertiesComponent } from '../../components/email-widget-properties/email-widget-properties.component';
import { EmailButtonWidgetPropertiesComponent } from '../../components/email-button-widget-properties/email-button-widget-properties.component';
import { EmailTextWidgetPropertiesComponent } from '../../components/email-text-widget-properties/email-text-widget-properties.component';


@NgModule({
  declarations: [
    EmailBuilderComponent,
    EmailEditorComponent,
    EmailInspectorComponent,
    EmailPropertiesComponent,
    EmailRowPropertiesComponent,
    PaddingComponent,
    VerticalAlignmentComponent,
    EmailColumnPropertiesComponent,
    HorizontalAlignmentComponent,
    EmailWidgetPropertiesComponent,
    EmailButtonWidgetPropertiesComponent,
    EmailTextWidgetPropertiesComponent
  ],
  imports: [
    CommonModule,
    EmailBuilderRoutingModule,
    PropertiesModule,
    IconButtonModule,
    SearchModule,
    DropdownModule,
    PanelModule
  ]
})
export class EmailBuilderModule { }
