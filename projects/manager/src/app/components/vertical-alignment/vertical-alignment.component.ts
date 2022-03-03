import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { VerticalAlignmentType, VerticalAlignment, VerticalAlignmentValue } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'vertical-alignment',
  templateUrl: './vertical-alignment.component.html',
  styleUrls: ['./vertical-alignment.component.scss']
})
export class VerticalAlignmentComponent implements OnInit, OnChanges {
  @Input() verticalAlignment!: VerticalAlignment;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;
  public selectedVerticalAlignmentType: VerticalAlignmentType = VerticalAlignmentType.Top;
  public verticalAlignmentType = VerticalAlignmentType;
  public isBreakpointCheckboxChecked: boolean = false;

  constructor(private widgetServce: WidgetService) { }

  ngOnInit(): void {
    // Subscribe to breakpoint changes
    this.widgetServce.$breakpointChange.subscribe(() => {
      if (this.verticalAlignment.values && this.verticalAlignment.values.length > 0 && this.verticalAlignment.values.some(x => x.breakpoint)) {
        this.setSelectedVerticalAlignmentType();
      }
    });
  }

  ngOnChanges(): void {
    this.setSelectedVerticalAlignmentType();
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
        if (this.checkbox) this.checkbox.nativeElement.checked = true;
        this.isBreakpointCheckboxChecked = true;
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
      if (this.checkbox) this.checkbox.nativeElement.checked = false;
      this.isBreakpointCheckboxChecked = false;
    }
  }


  createValue(verticalAlignType: VerticalAlignmentType): VerticalAlignmentValue {
    let verticalAlignmentValue: VerticalAlignmentValue = new VerticalAlignmentValue();

    verticalAlignmentValue.verticalAlignmentType = verticalAlignType;
    this.selectedVerticalAlignmentType = verticalAlignType;
    this.verticalAlignment.values.push(verticalAlignmentValue);

    return verticalAlignmentValue;
  }


  onClick(verticalAlignType: VerticalAlignmentType) {
    const verticalAlignmentValue = this.verticalAlignment.values.find(x => x.breakpoint == this.widgetServce.getBreakpoint(this.verticalAlignment.values.map(x => x.breakpoint as string)) || x.breakpoint == null);

    if (verticalAlignmentValue) {
      verticalAlignmentValue.verticalAlignmentType = verticalAlignType;
      this.selectedVerticalAlignmentType = verticalAlignType;
    } else {
      this.createValue(verticalAlignType);
    }

    this.onChange.emit();
  }


  onCheckboxChange(breakpointCheckbox: HTMLInputElement) {
    this.isBreakpointCheckboxChecked = breakpointCheckbox.checked;

    let verticalAlignmentValue = this.verticalAlignment.values.find(x => x.verticalAlignmentType == this.selectedVerticalAlignmentType);

    if (breakpointCheckbox.checked) {
      if (!verticalAlignmentValue) {
        verticalAlignmentValue = this.createValue(this.selectedVerticalAlignmentType);
      }

      verticalAlignmentValue.breakpoint = this.widgetServce.currentBreakpoint;
    } else {
      if (verticalAlignmentValue) {
        verticalAlignmentValue.breakpoint = null;

        const index = this.verticalAlignment.values.findIndex(x => !x.breakpoint && x != verticalAlignmentValue);

        if (index != -1) {
          this.verticalAlignment.values.splice(index, 1);
        }

        this.setSelectedVerticalAlignmentType();
      }
    }

    this.onChange.emit();
  }
}