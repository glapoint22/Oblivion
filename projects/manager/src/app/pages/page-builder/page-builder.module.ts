import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { PageBuilderComponent } from './page-builder.component';
import { PageEditorComponent } from '../../components/page-editor/page-editor.component';
import { PageInspectorComponent } from '../../components/page-inspector/page-inspector.component';
import { IconButtonModule } from '../../components/icon-button/icon-button.module';
import { SearchModule } from '../../components/search/search.module';
import { PagePropertiesComponent } from '../../components/page-properties/page-properties.component';
import { FormsModule } from '@angular/forms';
import { PageKeywordsComponent } from '../../components/page-keywords/page-keywords.component';
import { PageNichesComponent } from '../../components/page-niches/page-niches.component';
import { ListModule } from '../../components/lists/list/list.module';
import { CheckboxHierarchyModule } from '../../components/hierarchies/checkbox-hierarchy/checkbox-hierarchy.module';
import { PropertiesModule } from '../../components/properties/properties.module';
import { PageRowPropertiesComponent } from '../../components/page-row-properties/page-row-properties.component';
import { BreakpointsPaddingComponent } from '../../components/breakpoints-padding/breakpoints-padding';
import { PanelModule } from '../../components/panel/panel.module';
import { BreakpointsVerticalAlignmentComponent } from '../../components/breakpoints-vertical-alignment/breakpoints-vertical-alignment';
import { PageColumnPropertiesComponent } from '../../components/page-column-properties/page-column-properties.component';
import { ColumnSpanComponent } from '../../components/column-span/column-span.component';
import { BreakpointsHorizontalAlignmentComponent } from '../../components/breakpoints-horizontal-alignment/breakpoints-horizontal-alignment';
import { PageWidgetPropertiesComponent } from '../../components/page-widget-properties/page-widget-properties.component';
import { ButtonWidgetPropertiesComponent } from '../../components/button-widget-properties/button-widget-properties.component';
import { PageTextWidgetPropertiesComponent } from '../../components/page-text-widget-properties/page-text-widget-properties.component';
import { VideoWidgetPropertiesComponent } from '../../components/video-widget-properties/video-widget-properties.component';
import { ProductSliderWidgetPropertiesComponent } from '../../components/product-slider-widget-properties/product-slider-widget-properties.component';
import { CarouselWidgetPropertiesComponent } from '../../components/carousel-widget-properties/carousel-widget-properties.component';
import { PageButtonWidgetPropertiesComponent } from '../../components/page-button-widget-properties/page-button-widget-properties.component';
import { ButtonColorComponent } from '../../components/button-color/button-color.component';
import { ColorSwatchModule } from '../../components/color-swatch/color-swatch.module';
import { CounterModule } from '../../components/counter/counter.module';
import { ImageBoxModule } from '../../components/image-box/image-box.module';
import { VideoPropertiesEditorComponent } from '../../components/video-properties-editor/video-properties-editor.component';
import { QueryBuilderComponent } from '../../components/query-builder/query-builder.component';
import { QueryComponent } from '../../components/query/query.component';
import { QueryRowComponent } from '../../components/query-row/query-row.component';
import { QueryGroupComponent } from '../../components/query-group/query-group.component';
import { DropdownModule } from 'common';
import { MenuBarModule } from '../../components/menu-bar/menu-bar.module';
import { NichesWidgetPropertiesComponent } from '../../components/niches-widget-properties/niches-widget-properties.component';
import { PosterWidgetPropertiesComponent } from '../../components/poster-widget-properties/poster-widget-properties.component';


@NgModule({
  declarations: [
    PageBuilderComponent,
    PageEditorComponent,
    PageInspectorComponent,
    PagePropertiesComponent,
    PageKeywordsComponent,
    PageNichesComponent,
    PageRowPropertiesComponent,
    BreakpointsPaddingComponent,
    BreakpointsVerticalAlignmentComponent,
    BreakpointsHorizontalAlignmentComponent,
    PageColumnPropertiesComponent,
    ColumnSpanComponent,
    PageWidgetPropertiesComponent,
    ButtonWidgetPropertiesComponent,
    PageTextWidgetPropertiesComponent,
    VideoWidgetPropertiesComponent,
    ProductSliderWidgetPropertiesComponent,
    CarouselWidgetPropertiesComponent,
    PageButtonWidgetPropertiesComponent,
    ButtonColorComponent,
    VideoPropertiesEditorComponent,
    QueryBuilderComponent,
    QueryComponent,
    QueryRowComponent,
    QueryGroupComponent,
    NichesWidgetPropertiesComponent,
    PosterWidgetPropertiesComponent
  ],
  imports: [
    CommonModule,
    PageBuilderRoutingModule,
    IconButtonModule,
    SearchModule,
    FormsModule,
    ListModule,
    CheckboxHierarchyModule,
    PropertiesModule,
    PanelModule,
    ColorSwatchModule,
    CounterModule,
    ImageBoxModule,
    DropdownModule,
    MenuBarModule
  ]
})
export class PageBuilderModule { }
