import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Media } from '../../classes/media';

@Component({
  selector: 'media-slider',
  templateUrl: './media-slider.component.html',
  styleUrls: ['./media-slider.component.scss']
})
export class MediaSliderComponent implements OnChanges {
  @Input() media!: Array<Media>;
  public changeCount: number = 0;

  ngOnChanges(): void {
    this.changeCount++;
  }
}