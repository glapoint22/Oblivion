import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetInspectorComponent } from './widget-inspector.component';
import { WidgetService } from '../../services/widget/widget.service';
import { PagePropertiesComponent } from '../page-properties/page-properties.component';
import { DropdownModule } from 'common';
import { FormsModule } from '@angular/forms';
import { RowPropertiesComponent } from '../row-properties/row-properties.component';
import { ColumnPropertiesComponent } from '../column-properties/column-properties.component';
import { WidgetPropertiesComponent } from '../widget-properties/widget-properties.component';
import { PanelModule } from '../panel/panel.module';
import { BackgroundComponent } from '../background/background.component';
import { ColorSwatchComponent } from '../color-swatch/color-swatch.component';
import { ImageBoxModule } from '../image-box/image-box.module';
import { BorderComponent } from '../border/border.component';
import { NumberFieldModule } from '../number-field/number-field.module';
import { CornersComponent } from '../corners/corners.component';
import { ShadowComponent } from '../shadow/shadow.component';
import { PaddingComponent } from '../padding/padding.component';
import { VerticalAlignmentComponent } from '../vertical-alignment/vertical-alignment.component';
import { HorizontalAlignmentComponent } from '../horizontal-alignment/horizontal-alignment.component';
import { ButtonWidgetPropertiesComponent } from '../button-widget-properties/button-widget-properties.component';
import { ButtonWidgetNormalPropertiesComponent } from '../button-widget-normal-properties/button-widget-normal-properties.component';
import { ButtonColorComponent } from '../button-color/button-color.component';
import { ColumnSpanComponent } from '../column-span/column-span.component';
import { CaptionComponent } from '../caption/caption.component';



@NgModule({
  declarations: [
    WidgetInspectorComponent,
    PagePropertiesComponent,
    RowPropertiesComponent,
    ColumnPropertiesComponent,
    WidgetPropertiesComponent,
    BackgroundComponent,
    ColorSwatchComponent,
    BorderComponent,
    CornersComponent,
    ShadowComponent,
    PaddingComponent,
    VerticalAlignmentComponent,
    HorizontalAlignmentComponent,
    ButtonWidgetPropertiesComponent,
    ButtonWidgetNormalPropertiesComponent,
    ButtonColorComponent,
    ColumnSpanComponent,
    CaptionComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    PanelModule,
    ImageBoxModule,
    NumberFieldModule
  ],
  exports: [WidgetInspectorComponent],
  providers: [
    {
      provide: WidgetService,
      useValue: (window as any).widgetService
    }
  ]
})
export class WidgetInspectorModule { }
