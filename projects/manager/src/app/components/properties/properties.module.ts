import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from '../background/background.component';
import { ImageBoxModule } from '../image-box/image-box.module';
import { FormsModule } from '@angular/forms';
import { ColorSwatchModule } from '../color-swatch/color-swatch.module';
import { PanelModule } from '../panel/panel.module';
import { BorderComponent } from '../border/border.component';
import { NumberFieldComponent } from '../number-field/number-field.component';
import { CornersComponent } from '../corners/corners.component';
import { ShadowComponent } from '../shadow/shadow.component';
import { LineWidgetPropertiesComponent } from '../line-widget-properties/line-widget-properties.component';
import { ImageWidgetPropertiesComponent } from '../image-widget-properties/image-widget-properties.component';
import { ContainerWidgetPropertiesComponent } from '../container-widget-properties/container-widget-properties.component';
import { LinkPropertyComponent } from '../link-property/link-property.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { CaptionComponent } from '../caption/caption.component';
import { TextComponent } from '../text/text.component';
import { DropdownModule } from '../dropdown/dropdown.module';



@NgModule({
  declarations: [
    BackgroundComponent,
    BorderComponent,
    NumberFieldComponent,
    CornersComponent,
    ShadowComponent,
    LineWidgetPropertiesComponent,
    ImageWidgetPropertiesComponent,
    ContainerWidgetPropertiesComponent,
    LinkPropertyComponent,
    CaptionComponent,
    TextComponent
  ],
  imports: [
    CommonModule,
    ImageBoxModule,
    FormsModule,
    ColorSwatchModule,
    PanelModule,
    IconButtonModule,
    DropdownModule
  ],
  exports: [
    BackgroundComponent,
    BorderComponent,
    NumberFieldComponent,
    CornersComponent,
    ShadowComponent,
    LineWidgetPropertiesComponent,
    ImageWidgetPropertiesComponent,
    ContainerWidgetPropertiesComponent,
    LinkPropertyComponent,
    CaptionComponent,
    TextComponent
  ]
})
export class PropertiesModule { }
