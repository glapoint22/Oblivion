import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersPanelComponent } from './filters-panel.component';
import { CustomFilterComponent } from '../custom-filter/custom-filter.component';
import { NichesFilterComponent } from '../niches-filter/niches-filter.component';
import { PriceFilterComponent } from '../price-filter/price-filter.component';
import { RatingFilterComponent } from '../rating-filter/rating-filter.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StarsModule } from '../stars/stars.module';
import { FilterContainerModule } from '../filter-container/filter-container.module';



@NgModule({
  declarations: [
    FiltersPanelComponent,
    NichesFilterComponent,
    PriceFilterComponent,
    RatingFilterComponent,
    CustomFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    StarsModule,
    FormsModule,
    FilterContainerModule
  ],
  exports: [FiltersPanelComponent]
})
export class FiltersPanelModule { }
