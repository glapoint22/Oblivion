import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BreakpointValue } from 'widgets';

@Component({
  selector: 'breakpoint-value-displayer',
  templateUrl: './breakpoint-value-displayer.component.html',
  styleUrls: ['./breakpoint-value-displayer.component.scss']
})
export class BreakpointValueDisplayerComponent<T> {
  @Input() breakpointValue!: BreakpointValue<T>;
  @Input() breakpointOptions!: Array<any>;
  @Input() isSelected!: boolean;
  @Output() onChange: EventEmitter<void> = new EventEmitter();

  onClick(direction: number) {
    const index = this.breakpointOptions.findIndex(x => x == this.breakpointValue.getValue());
    let value: T;

    if (direction == 1) {
      if (index == this.breakpointOptions.length - 1) {
        value = this.breakpointOptions[0];
      } else {
        value = this.breakpointOptions[index + 1];
      }
    } else {
      if (index == 0) {
        value = this.breakpointOptions[this.breakpointOptions.length - 1];
      } else {
        value = this.breakpointOptions[index - 1];
      }
    }
    this.breakpointValue.setValue(value);
    this.onChange.emit();
  }
}