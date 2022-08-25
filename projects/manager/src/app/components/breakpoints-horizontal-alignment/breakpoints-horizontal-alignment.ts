import { Component, Input } from '@angular/core';
import { Breakpoint, HorizontalAlignment, HorizontalAlignmentType, HorizontalAlignmentValue } from 'widgets';
import { BreakpointsComponent } from '../breakpoints/breakpoints.component';

@Component({
  selector: 'breakpoints-horizontal-alignment',
  templateUrl: '../breakpoints/breakpoints.component.html',
  styleUrls: ['../breakpoints/breakpoints.component.scss']
})
export class BreakpointsHorizontalAlignmentComponent extends BreakpointsComponent<HorizontalAlignmentValue, string> {
  @Input() horizontalAlignment!: HorizontalAlignment;
  public breakpointOptions: Array<string> = [
    'align-left.png',
    'align-center.png',
    'align-right.png'
  ];


  // --------------------------------------------------------------------- Ng On Init -------------------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    this.title = 'Horizontal Alignment';
    this.isImage = true;
  }






  // --------------------------------------------------------------------- Set Value ---------------------------------------------------------
  public setValue(breakpointValue: HorizontalAlignmentValue, value: string, direction: number): void {
    breakpointValue.setValue(value);

    super.setValue(breakpointValue, value, direction);
  }






  // -------------------------------------------------------------------- Get Breakpoints ---------------------------------------------------------
  public getBreakpoints(): Array<Breakpoint> {
    if (this.horizontalAlignment.values.length == 0) {
      this.horizontalAlignment.values.push(new HorizontalAlignmentValue(HorizontalAlignmentType.Left, 0));
    }

    this.horizontalAlignment.values = this.horizontalAlignment.values.sort((a, b) => a.breakpoint > b.breakpoint ? 1 : -1);

    const breakpoints: Array<Breakpoint> = new Array<Breakpoint>();

    breakpoints.push({
      label: 'Horizontal Alignment',
      values: []
    });

    const breakpoint = breakpoints[0];

    this.horizontalAlignment.values.forEach((value: HorizontalAlignmentValue) => {
      breakpoint.values.push(value);
    });

    return breakpoints;
  }






  // --------------------------------------------------------------------- Add Breakpoint ---------------------------------------------------------
  public addBreakpoint(breakpoint: number, label?: string): HorizontalAlignmentValue {
    let horizontalAlignmentType!: HorizontalAlignmentType;


    for (let i = this.horizontalAlignment.values.length - 1; i > -1; i--) {
      const currentValue = this.horizontalAlignment.values[i];

      if (currentValue.breakpoint! < breakpoint) {
        horizontalAlignmentType = currentValue.horizontalAlignmentType;
        break;
      }
    }

    const horizontalAlignmentValue = new HorizontalAlignmentValue(horizontalAlignmentType, breakpoint);
    this.horizontalAlignment.values.push(horizontalAlignmentValue);

    return horizontalAlignmentValue;
  }



  // --------------------------------------------------------------------- Delete Breakpoint ---------------------------------------------------------
  public deleteBreakpoint(value: HorizontalAlignmentValue): void {
    const index = this.horizontalAlignment.values.findIndex(x => x == value);

    this.horizontalAlignment.values.splice(index, 1);
    if (value.breakpoint == 0) {
      this.horizontalAlignment.values[index].breakpoint = 0;
    }
  }



  // ------------------------------------------------------------------------- Can Delete --------------------------------------------------------------
  public canDelete(value: HorizontalAlignmentValue): boolean {
    return this.horizontalAlignment.values.length > 1;
  }





  // --------------------------------------------------------------------------- Can Add ----------------------------------------------------------------
  public canAdd(breakpoint: number, label?: string): boolean {
    return !this.horizontalAlignment.values.some(x => x.breakpoint == breakpoint);
  }
}