import { Component, Input } from '@angular/core';

@Component({
  selector: 'stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent {
  @Input() rating!: number;

  getStar(i: number): string {
    if (i <= Math.floor(this.rating)) {
      return 'full-star';
    } else {
      if (i > Math.floor(this.rating) && i < Math.floor(this.rating) + 2 && this.rating % 1 > 0) {
        return 'half-star';
      } else {
        return 'empty-star';
      }
    }
  }
}
