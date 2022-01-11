import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersPanelComponent } from './filters-panel.component';
import { CustomFilterComponent } from '../custom-filter/custom-filter.component';
import { FilterContainerComponent } from '../filter-container/filter-container.component';
import { NichesFilterComponent } from '../niches-filter/niches-filter.component';
import { PriceFilterComponent } from '../price-filter/price-filter.component';
import { RatingFilterComponent } from '../rating-filter/rating-filter.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StarsModule } from '../stars/stars.module';



@NgModule({
  declarations: [
    FiltersPanelComponent,
    FilterContainerComponent,
    NichesFilterComponent,
    PriceFilterComponent,
    RatingFilterComponent,
    CustomFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    StarsModule,
    FormsModule
  ],
  exports: [FiltersPanelComponent]
})
export class FiltersPanelModule { }
