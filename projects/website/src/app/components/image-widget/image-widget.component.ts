import { Component } from '@angular/core';
import { Border } from '../../classes/border';
import { Corners } from '../../classes/corners';
import { Image } from '../../classes/image';
import { ImageWidgetData } from '../../classes/image-widget-data';
import { Link } from '../../classes/link';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { LinkOption } from '../../classes/widget-enums';

@Component({
  selector: 'image-widget',
  templateUrl: './image-widget.component.html',
  styleUrls: ['./image-widget.component.scss']
})
export class ImageWidgetComponent extends Widget {
  public linkOption = LinkOption;
  public border!: Border;
  public corners!: Corners;
  public shadow!: Shadow;
  public link!: Link;
  public image!: Image;

  setWidget(imageWidgetData: ImageWidgetData) {
    this.border = imageWidgetData.border;
    this.corners = imageWidgetData.corners;
    this.shadow = imageWidgetData.shadow;
    this.link = imageWidgetData.link;
    this.image = imageWidgetData.image;

    super.setWidget(imageWidgetData);
  }
}
