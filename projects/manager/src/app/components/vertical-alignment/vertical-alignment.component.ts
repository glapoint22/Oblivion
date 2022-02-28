import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { VerticalAlignmentType, VerticalAlignment, VerticalAlignmentValue } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'vertical-alignment',
  templateUrl: './vertical-alignment.component.html',
  styleUrls: ['./vertical-alignment.component.scss']
})
export class VerticalAlignmentComponent implements OnInit {
  @Input() verticalAlignment!: VerticalAlignment;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;
  public selectedVerticalAlignmentType: VerticalAlignmentType = VerticalAlignmentType.Top;
  public verticalAlignmentType = VerticalAlignmentType;

  constructor(private widgetServce: WidgetService) { }

  ngOnInit(): void {
    // Subscribe to breakpoint changes
    this.widgetServce.$breakpointChange.subscribe(() => {
      if (this.verticalAlignment.values && this.verticalAlignment.values.length > 0 && this.verticalAlignment.values.some(x => x.breakpoint)) {
        this.setSelectedVerticalAlignmentType();
      }
    });
  }


  setSelectedVerticalAlignmentType() {
    // Get the current breakpoint based on the array of vertical alignment values
    const breakpoint = this.widgetServce.getBreakpoint(this.verticalAlignment.values.map(x => x.breakpoint as string));


    if (breakpoint) {
      // Find the vertical alignment value that has this breakpoint
      const verticalAlignmentValue = this.verticalAlignment.values.find(x => x.breakpoint == breakpoint);

      // Assign the selected vertical alignment
      if (verticalAlignmentValue) {
        this.selectedVerticalAlignmentType = verticalAlignmentValue.verticalAlignmentType
        this.checkbox.nativeElement.checked = true;
      }


    } else {
      // Find any values without a breakpoint
      const verticalAlignmentValue = this.verticalAlignment.values.find(x => !x.breakpoint);

      // Assign the selected vertical alignment
      if (verticalAlignmentValue) {
        this.selectedVerticalAlignmentType = verticalAlignmentValue.verticalAlignmentType;
      } else {

        // Nothing found so assign the default
        this.selectedVerticalAlignmentType = VerticalAlignmentType.Top;
      }


      // Uncheck the checkbox
      this.checkbox.nativeElement.checked = false;
    }
  }





  onClick(verticalAlignType: VerticalAlignmentType) {
    let verticalAlignmentValue: VerticalAlignmentValue = new VerticalAlignmentValue();

    verticalAlignmentValue.verticalAlignmentType = verticalAlignType;

    // If we have no values, create an empty array
    if (!this.verticalAlignment.values || !this.verticalAlignment.values.some(x => x.breakpoint)) {
      this.verticalAlignment.values = [];
    } else {

      // Find any values with the current breakpoint or a value without a breakpoint
      const index = this.verticalAlignment.values.findIndex(x => x.breakpoint == this.widgetServce.currentBreakpoint || x.breakpoint == null);

      // If found, delete that value
      if (index != -1) {
        this.verticalAlignment.values.splice(index, 1);
      }

      // If the breakpoint checkbox is checked, assign the current breakpoint
      if (this.checkbox.nativeElement.checked) {
        verticalAlignmentValue.breakpoint = this.widgetServce.currentBreakpoint;
      }
    }

    // Push the new value and assign the value to the selected vertical alignment
    this.verticalAlignment.values.push(verticalAlignmentValue);
    this.selectedVerticalAlignmentType = verticalAlignType;

    this.onChange.emit();
  }


  onCheckboxChange() {
    // If the breakpoint checkbox is checked
    if (this.checkbox.nativeElement.checked) {

      // If we have no values, create an empty array
      if (!this.verticalAlignment.values || this.verticalAlignment.values.length == 0) {
        this.verticalAlignment.values = [];

        // Create the new value with the current breakpoint
        this.verticalAlignment.values.push({
          verticalAlignmentType: this.selectedVerticalAlignmentType,
          breakpoint: this.widgetServce.currentBreakpoint
        });

      } else {

        // Find the current value
        const verticalAlignmentValue = this.verticalAlignment.values.find(x => x.verticalAlignmentType == this.selectedVerticalAlignmentType);

        // If found, assign the current breakpoint
        if (verticalAlignmentValue) {
          verticalAlignmentValue.breakpoint = this.widgetServce.currentBreakpoint;
        } else {
          // If not found, create a new value with the current breakpoint
          this.verticalAlignment.values.push({
            verticalAlignmentType: this.selectedVerticalAlignmentType,
            breakpoint: this.widgetServce.currentBreakpoint
          });
        }
      }

      // The breakpoint checkbox is not checked
    } else {

      // Get the index of the selected value
      const index = this.verticalAlignment.values.findIndex(x => x.verticalAlignmentType == this.selectedVerticalAlignmentType);

      // If found delete the value
      if (index != -1) {
        this.verticalAlignment.values.splice(index, 1);

        // We have have values, set the selected vertical alignment
        if (this.verticalAlignment.values.length > 0) {
          this.setSelectedVerticalAlignmentType();
        } else {
          // Select the default
          this.selectedVerticalAlignmentType = VerticalAlignmentType.Top;
        }
      }
    }

    this.onChange.emit();
  }
}