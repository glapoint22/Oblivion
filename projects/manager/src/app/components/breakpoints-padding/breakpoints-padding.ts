import { Component, Input } from '@angular/core';
import { Breakpoint, Padding, PaddingType, PaddingValue } from 'widgets';
import { BreakpointsComponent } from '../breakpoints/breakpoints.component';

@Component({
  selector: 'breakpoints-padding',
  templateUrl: '../breakpoints/breakpoints.component.html',
  styleUrls: ['../breakpoints/breakpoints.component.scss']
})
export class BreakpointsPaddingComponent extends BreakpointsComponent<PaddingValue, number> {
  @Input() padding!: Padding;
  public breakpointOptions: Array<number> = [
    0,
    4,
    8,
    12,
    16,
    20,
    24,
    28,
    32,
    36,
    40,
    44,
    48
  ];


  // --------------------------------------------------------------------- Set Value ---------------------------------------------------------
  public setValue(paddingValue: PaddingValue, value: number, direction: number): void {
    paddingValue.setValue(value);

    super.setValue(paddingValue, value, direction);
  }





  // --------------------------------------------------------------------- Ng On Init -------------------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    this.title = 'Padding';
  }





  // -------------------------------------------------------------------- Get Breakpoints ---------------------------------------------------------
  public getBreakpoints(): Array<Breakpoint> {
    // Make sure all padding types have values
    for (let i = 0; i < 4; i++) {
      if (!this.padding.values.some(x => x.paddingType == i)) this.padding.values.push(new PaddingValue(i, 0, 0));
    }

    // Sort the values
    this.padding.values = this.padding.values.sort((a, b) => {
      if (a.paddingType > b.paddingType) {
        return 1;
      } else if (a.paddingType < b.paddingType) {
        return -1;
      }

      if (a.breakpoint! > b.breakpoint!) {
        return 1;
      } else if (a.breakpoint! < b.breakpoint!) {
        return -1;
      }

      return 0;
    });

    const breakpoints: Array<Breakpoint> = new Array<Breakpoint>();

    // Create the breakpoints
    this.padding.values.forEach((paddingValue: PaddingValue) => {
      const label = this.getLabel(paddingValue.paddingType);
      let breakpoint = breakpoints.find(x => x.label == label);

      if (!breakpoint) {
        // Create a new breakpoint
        breakpoints.push({
          label: label,
          values: [paddingValue]
        })
      } else {
        breakpoint.values.push(paddingValue);
      }
    });

    return breakpoints;
  }





  // -------------------------------------------------------------------- Add Breakpoint ---------------------------------------------------------
  public addBreakpoint(breakpoint: number, label?: string): PaddingValue {
    let padding!: number;
    const paddingType = this.getPaddingType(label!);

    for (let i = this.padding.values.length - 1; i > -1; i--) {
      const currentValue = this.padding.values[i];

      if (currentValue.paddingType == paddingType && currentValue.breakpoint! < breakpoint) {
        padding = currentValue.padding;
        break;
      }
    }

    const paddingValue = new PaddingValue(paddingType, padding, breakpoint);
    this.padding.values.push(paddingValue);

    return paddingValue;
  }





  // -------------------------------------------------------------------- Delete Breakpoint ---------------------------------------------------------
  public deleteBreakpoint(value: PaddingValue): void {
    const index = this.padding.values.findIndex(x => x == value);

    this.padding.values.splice(index, 1);
    if (value.breakpoint == 0) {
      this.padding.values[index].breakpoint = 0;
    }
  }





  // -------------------------------------------------------------------- Can Delete ---------------------------------------------------------
  public canDelete(value: PaddingValue): boolean {
    return this.padding.values.filter(x => x.paddingType == value.paddingType).length > 1;
  }




  // ---------------------------------------------------------------------- Can Add ------------------------------------------------------------
  public canAdd(breakpoint: number, label?: string | undefined): boolean {
    return !this.padding.values.some(x => x.breakpoint == breakpoint && x.paddingType == this.getPaddingType(label!));
  }





  // ----------------------------------------------------------------------- Get Label ------------------------------------------------------------
  private getLabel(paddingType: PaddingType): string {
    let padding: string;

    switch (paddingType) {
      case 0:
        padding = 'Top'
        break;

      case 1:
        padding = 'Right'
        break;

      case 2:
        padding = 'Bottom'
        break;

      case 3:
        padding = 'Left'
        break;
    }

    return padding!;
  }





  // ----------------------------------------------------------------------- Get Padding Type ------------------------------------------------------------
  private getPaddingType(label: string): number {
    let paddingType: PaddingType;

    switch (label) {
      case 'Top':
        paddingType = PaddingType.Top
        break;

      case 'Right':
        paddingType = PaddingType.Right
        break;

      case 'Bottom':
        paddingType = PaddingType.Bottom
        break;

      case 'Left':
        paddingType = PaddingType.Left
        break;
    }

    return paddingType!;
  }
}