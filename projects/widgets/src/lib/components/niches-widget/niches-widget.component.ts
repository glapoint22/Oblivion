import { Component } from '@angular/core';
import { Widget } from '../../classes/widget';
import { CarouselBanner } from '../../classes/carousel-banner';
import { WidgetType } from '../../classes/widget-enums';
import { NichesWidgetData } from '../../classes/niches-widget-data';
import { LinkType } from 'common';

@Component({
  selector: 'niches-widget',
  templateUrl: './niches-widget.component.html',
  styleUrls: ['./niches-widget.component.scss']
})
export class NichesWidgetComponent extends Widget {
  public niches: Array<CarouselBanner> = [];
  public linkType = LinkType;


  // ----------------------------------------------------------- Ng On Init --------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Niches;
  }



  // ----------------------------------------------------------- Set Widget --------------------------------------------------------------
  setWidget(nichesWidgetData: NichesWidgetData): void {
    if (nichesWidgetData.niches && nichesWidgetData.niches.length > 0) {
      this.niches = nichesWidgetData.niches;
    }

    super.setWidget(nichesWidgetData);
  }



  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): NichesWidgetData {
    const nichesWidgetData = super.getData() as NichesWidgetData;

    nichesWidgetData.niches = [];

    this.niches.forEach((niche: CarouselBanner) => {
      const newNiche = new CarouselBanner();

      newNiche.image.setData(niche.image);
      newNiche.link.setData(niche.link);
      newNiche.title = niche.title;

      nichesWidgetData.niches.push(newNiche);
    });

    return nichesWidgetData;
  }
}