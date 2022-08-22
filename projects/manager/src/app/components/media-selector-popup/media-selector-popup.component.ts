import { Component } from '@angular/core';
import { LazyLoad, MediaType } from 'common';

@Component({
  selector: 'media-selector-popup',
  templateUrl: './media-selector-popup.component.html',
  styleUrls: ['./media-selector-popup.component.scss']
})
export class MediaSelectorPopupComponent extends LazyLoad {
  public callback!: Function;
  public MediaType = MediaType;

  onClick(mediaType: MediaType) {
    this.callback(mediaType);
  }
}