import { Component } from '@angular/core';
import { Image, Link, LinkType } from 'common';
import { Border } from '../../classes/border';
import { Corners } from '../../classes/corners';
import { ImageWidgetData } from '../../classes/image-widget-data';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'image-widget',
  templateUrl: './image-widget.component.html',
  styleUrls: ['./image-widget.component.scss']
})
export class ImageWidgetComponent extends Widget {
  public border: Border = new Border();
  public corners: Corners = new Corners();
  public shadow: Shadow = new Shadow();
  public link: Link = new Link();
  public image: Image = new Image();
  public linkType = LinkType;



  // ------------------------------------------------------------ Ng On Init -----------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Image;
  }



  // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
  setWidget(imageWidgetData: ImageWidgetData) {
    this.border.setData(imageWidgetData.border);
    this.corners.setData(imageWidgetData.corners);
    this.shadow.setData(imageWidgetData.shadow);
    this.link.setData(imageWidgetData.link);
    this.image.setData(imageWidgetData.image);

    super.setWidget(imageWidgetData);
  }


  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): ImageWidgetData {
    const imageWidgetData = super.getData() as ImageWidgetData;

    imageWidgetData.border = this.border.getData();
    imageWidgetData.corners = this.corners.getData();
    imageWidgetData.shadow = this.shadow.getData();
    imageWidgetData.link = this.link.getData();
    imageWidgetData.image = this.image.getData();

    return imageWidgetData;
  }
}