import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { HorizontalAlignment, HorizontalAlignmentType, HorizontalAlignmentValue } from 'widgets';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Component({
  selector: 'horizontal-alignment',
  templateUrl: './horizontal-alignment.component.html',
  styleUrls: ['./horizontal-alignment.component.scss']
})
export class HorizontalAlignmentComponent implements OnInit, OnChanges {
  @Input() horizontalAlignment!: HorizontalAlignment;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;
  public selectedHorizontalAlignmentType: HorizontalAlignmentType = HorizontalAlignmentType.Left;
  public horizontalAlignmentType = HorizontalAlignmentType;
  public isBreakpointCheckboxChecked: boolean = false;

  constructor(private breakpointService: BreakpointService) { }

  ngOnInit(): void {
    // Subscribe to breakpoint changes
    this.breakpointService.$breakpointChange.subscribe(() => {
      if (this.horizontalAlignment.values && this.horizontalAlignment.values.length > 0 && this.horizontalAlignment.values.some(x => x.breakpoint)) {
        this.setSelectedHorizontalAlignmentType();
      }
    });
  }

  ngOnChanges(): void {
    this.setSelectedHorizontalAlignmentType();
  }


  setSelectedHorizontalAlignmentType() {
    // Get the current breakpoint based on the array of horizontal alignment values
    const breakpoint = this.breakpointService.getBreakpoint(this.horizontalAlignment.values.map(x => x.breakpoint as string));


    if (breakpoint) {
      // Find the horizontal alignment value that has this breakpoint
      const horizontalAlignmentValue = this.horizontalAlignment.values.find(x => x.breakpoint == breakpoint);

      // Assign the selected horizontal alignment
      if (horizontalAlignmentValue) {
        this.selectedHorizontalAlignmentType = horizontalAlignmentValue.horizontalAlignmentType
        if (this.checkbox) this.checkbox.nativeElement.checked = true;
        this.isBreakpointCheckboxChecked = true;
      }


    } else {
      // Find any values without a breakpoint
      const horizontalAlignmentValue = this.horizontalAlignment.values.find(x => !x.breakpoint);

      // Assign the selected horizontal alignment
      if (horizontalAlignmentValue) {
        this.selectedHorizontalAlignmentType = horizontalAlignmentValue.horizontalAlignmentType;
      } else {

        // Nothing found so assign the default
        this.selectedHorizontalAlignmentType = HorizontalAlignmentType.Left;
      }


      // Uncheck the checkbox
      if (this.checkbox) this.checkbox.nativeElement.checked = false;
      this.isBreakpointCheckboxChecked = false;
    }
  }


  createValue(horizontalAlignmentType: HorizontalAlignmentType): HorizontalAlignmentValue {
    let horizontalAlignmentValue: HorizontalAlignmentValue = new HorizontalAlignmentValue();

    horizontalAlignmentValue.horizontalAlignmentType = horizontalAlignmentType;
    this.selectedHorizontalAlignmentType = horizontalAlignmentType;
    this.horizontalAlignment.values.push(horizontalAlignmentValue);

    return horizontalAlignmentValue;
  }


  onClick(horizontalAlignmentType: HorizontalAlignmentType) {
    const horizontalAlignmentValue = this.horizontalAlignment.values.find(x => x.breakpoint == this.breakpointService.getBreakpoint(this.horizontalAlignment.values.map(x => x.breakpoint as string)) || x.breakpoint == null);

    if (horizontalAlignmentValue) {
      horizontalAlignmentValue.horizontalAlignmentType = horizontalAlignmentType;
      this.selectedHorizontalAlignmentType = horizontalAlignmentType;
    } else {
      this.createValue(horizontalAlignmentType);
    }

    this.onChange.emit();
  }


  onCheckboxChange(breakpointCheckbox: HTMLInputElement) {
    this.isBreakpointCheckboxChecked = breakpointCheckbox.checked;

    let horizontalAlignmentValue = this.horizontalAlignment.values.find(x => x.horizontalAlignmentType == this.selectedHorizontalAlignmentType);

    if (breakpointCheckbox.checked) {
      if (!horizontalAlignmentValue) {
        horizontalAlignmentValue = this.createValue(this.selectedHorizontalAlignmentType);
      }

      horizontalAlignmentValue.breakpoint = this.breakpointService.currentBreakpoint;
    } else {
      if (horizontalAlignmentValue) {
        horizontalAlignmentValue.breakpoint = null;

        const index = this.horizontalAlignment.values.findIndex(x => !x.breakpoint && x != horizontalAlignmentValue);

        if (index != -1) {
          this.horizontalAlignment.values.splice(index, 1);
        }

        this.setSelectedHorizontalAlignmentType();
      }
    }

    this.onChange.emit();
  }
}
