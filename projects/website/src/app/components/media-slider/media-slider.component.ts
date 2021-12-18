import { Component, Input, OnInit } from '@angular/core';
import { Media } from '../../classes/media';

@Component({
  selector: 'media-slider',
  templateUrl: './media-slider.component.html',
  styleUrls: ['./media-slider.component.scss']
})
export class MediaSliderComponent implements OnInit {
  @Input() media!: Array<Media>;

  constructor() { }

  ngOnInit(): void {
  }

}
