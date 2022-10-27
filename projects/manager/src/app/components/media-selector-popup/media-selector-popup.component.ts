import { Component } from '@angular/core';
import { LazyLoad, MediaType } from 'common';
import { Subject } from 'rxjs';

@Component({
  selector: 'media-selector-popup',
  templateUrl: './media-selector-popup.component.html',
  styleUrls: ['./media-selector-popup.component.scss']
})
export class MediaSelectorPopupComponent extends LazyLoad {
  public callback!: Function;
  public MediaType = MediaType;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    this.close();
  }

  onClick(mediaType: MediaType) {
    this.callback(mediaType);
  }


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}