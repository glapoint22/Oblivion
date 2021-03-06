import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetInspectorComponent } from './widget-inspector.component';
import { PagePropertiesComponent } from '../page-properties/page-properties.component';
import { DropdownModule } from 'common';
import { FormsModule } from '@angular/forms';
import { RowPropertiesComponent } from '../row-properties/row-properties.component';
import { ColumnPropertiesComponent } from '../column-properties/column-properties.component';
import { WidgetPropertiesComponent } from '../widget-properties/widget-properties.component';
import { PanelModule } from '../panel/panel.module';
import { BackgroundComponent } from '../background/background.component';
import { ImageBoxModule } from '../image-box/image-box.module';
import { BorderComponent } from '../border/border.component';
import { NumberFieldModule } from '../number-field/number-field.module';
import { CornersComponent } from '../corners/corners.component';
import { ShadowComponent } from '../shadow/shadow.component';
import { VerticalAlignmentComponent } from '../vertical-alignment/vertical-alignment.component';
import { HorizontalAlignmentComponent } from '../horizontal-alignment/horizontal-alignment.component';
import { ButtonWidgetPropertiesComponent } from '../button-widget-properties/button-widget-properties.component';
import { ButtonWidgetNormalPropertiesComponent } from '../button-widget-normal-properties/button-widget-normal-properties.component';
import { ButtonColorComponent } from '../button-color/button-color.component';
import { ColumnSpanComponent } from '../column-span/column-span.component';
import { CaptionComponent } from '../caption/caption.component';
import { TextWidgetPropertiesComponent } from '../text-widget-properties/text-widget-properties.component';
import { TextComponent } from '../text/text.component';
import { LineWidgetPropertiesComponent } from '../line-widget-properties/line-widget-properties.component';
import { ImageWidgetPropertiesComponent } from '../image-widget-properties/image-widget-properties.component';
import { ContainerWidgetPropertiesComponent } from '../container-widget-properties/container-widget-properties.component';
import { VideoWidgetPropertiesComponent } from '../video-widget-properties/video-widget-properties.component';
import { ProductSliderWidgetPropertiesComponent } from '../product-slider-widget-properties/product-slider-widget-properties.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { VideoPropertiesEditorComponent } from '../video-properties-editor/video-properties-editor.component';
import { CarouselWidgetPropertiesComponent } from '../carousel-widget-properties/carousel-widget-properties.component';
import { CounterModule } from '../counter/counter.module';
import { LinkPropertyComponent } from '../link-property/link-property.component';
import { SearchModule } from '../search/search.module';
import { ListModule } from '../lists/list/list.module';
import { CheckboxHierarchyModule } from '../hierarchies/checkbox-hierarchy/checkbox-hierarchy.module';
import { PageNichesComponent } from '../page-niches/page-niches.component';
import { PageKeywordsComponent } from '../page-keywords/page-keywords.component';
import { PaddingComponent } from '../padding/padding.component';
import { ColorSwatchModule } from '../color-swatch/color-swatch.module';



@NgModule({
  declarations: [
    WidgetInspectorComponent,
    PagePropertiesComponent,
    RowPropertiesComponent,
    ColumnPropertiesComponent,
    WidgetPropertiesComponent,
    BackgroundComponent,
    BorderComponent,
    CornersComponent,
    ShadowComponent,
    VerticalAlignmentComponent,
    HorizontalAlignmentComponent,
    ButtonWidgetPropertiesComponent,
    ButtonWidgetNormalPropertiesComponent,
    ButtonColorComponent,
    ColumnSpanComponent,
    CaptionComponent,
    TextWidgetPropertiesComponent,
    TextComponent,
    LineWidgetPropertiesComponent,
    ImageWidgetPropertiesComponent,
    ContainerWidgetPropertiesComponent,
    VideoWidgetPropertiesComponent,
    ProductSliderWidgetPropertiesComponent,
    VideoPropertiesEditorComponent,
    CarouselWidgetPropertiesComponent,
    LinkPropertyComponent,
    PageNichesComponent,
    PageKeywordsComponent,
    PaddingComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    PanelModule,
    ImageBoxModule,
    NumberFieldModule,
    IconButtonModule,
    CounterModule,
    SearchModule,
    ListModule,
    CheckboxHierarchyModule,
    ColorSwatchModule
  ],
  exports: [WidgetInspectorComponent]
})
export class WidgetInspectorModule { }
