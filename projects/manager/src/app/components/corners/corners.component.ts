import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Corners } from 'widgets';

@Component({
  selector: 'corners',
  templateUrl: './corners.component.html',
  styleUrls: ['./corners.component.scss']
})
export class CornersComponent {
  @Input() corners!: Corners;
  @Output() onChange: EventEmitter<void> = new EventEmitter();

  onValueChange(corner: string, value: number) {
    // If the corners are constrained, set the value for each corner
    if (this.corners.constrain) {
      this.corners.topLeft = value;
      this.corners.topRight = value;
      this.corners.bottomRight = value;
      this.corners.bottomLeft = value;
    } else {
      if (corner == 'topLeft') this.corners.topLeft = value;
      if (corner == 'topRight') this.corners.topRight = value;
      if (corner == 'bottomRight') this.corners.bottomRight = value;
      if (corner == 'bottomLeft') this.corners.bottomLeft = value;
    }

    this.onChange.emit();
  }
}
