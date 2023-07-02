import { Component, ElementRef, ViewChild } from '@angular/core';
import { NichesWidgetDevComponent } from '../niches-widget-dev/niches-widget-dev.component';
import { WidgetProperties } from '../../classes/widget-properties';
import { WidgetService } from '../../services/widget/widget.service';
import { CounterComponent } from '../counter/counter.component';
import { CarouselBanner } from 'widgets';

@Component({
  selector: 'niches-widget-properties',
  templateUrl: './niches-widget-properties.component.html',
  styleUrls: ['./niches-widget-properties.component.scss']
})
export class NichesWidgetPropertiesComponent extends WidgetProperties<NichesWidgetDevComponent> {
  @ViewChild('#titleInput') searchInput!: ElementRef<HTMLInputElement>;


  constructor(widgetService: WidgetService) { super(widgetService) }

  


  // --------------------------------------------------------------------- Add Niche --------------------------------------------------------
  addNiche(counter: CounterComponent) {
    this.widget.niches.push(new CarouselBanner());
    counter.set(this.widget.niches.length);
    this.widget.currentNicheIndex = this.widget.niches.length - 1;
    this.update();
  }


  // --------------------------------------------------------------------- Delete Niche --------------------------------------------------------
  deleteNiche(counter: CounterComponent) {
    if (this.widget.niches[this.widget.currentNicheIndex].image && this.widget.niches[this.widget.currentNicheIndex].image.src) {
    }


    // Remove the niche
    this.widget.niches.splice(this.widget.currentNicheIndex, 1);

    // If we still have niches left
    if (this.widget.niches.length > 0) {
      this.widget.currentNicheIndex = Math.min(this.widget.niches.length - 1, this.widget.currentNicheIndex);
      counter.set(this.widget.currentNicheIndex + 1);
    }

    this.update();
  }


  onTitleChange(title: string) {
    this.widget.niches[this.widget.currentNicheIndex].title = title;
    this.update();
  }
}