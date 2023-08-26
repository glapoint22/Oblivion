import { Component } from '@angular/core';
import { Widget } from '../../classes/widget';
import { Image, Link, LinkType } from 'common';
import { WidgetType } from '../../classes/widget-enums';
import { PosterWidgetData } from '../../classes/poster-widget-data';

@Component({
  selector: 'poster-widget',
  templateUrl: './poster-widget.component.html',
  styleUrls: ['./poster-widget.component.scss']
})
export class PosterWidgetComponent extends Widget {
  public image: Image = new Image();
  public image2: Image = new Image();
  public link: Link = new Link();
  public linkType = LinkType;


  // ----------------------------------------------------------- Ng On Init --------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Poster;
  }



  // ----------------------------------------------------------- Set Widget --------------------------------------------------------------
  setWidget(posterWidgetData: PosterWidgetData): void {
    this.image.setData(posterWidgetData.image);
    this.image2.setData(posterWidgetData.image2);
    this.link.setData(posterWidgetData.link);

    super.setWidget(posterWidgetData);
  }



  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): PosterWidgetData {
    const posterWidgetData = super.getData() as PosterWidgetData;

    posterWidgetData.image = this.image.getData();
    posterWidgetData.image2 = this.image2.getData();
    posterWidgetData.link = this.link.getData();

    return posterWidgetData;
  }
}