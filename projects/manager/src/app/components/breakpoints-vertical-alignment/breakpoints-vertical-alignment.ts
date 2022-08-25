import { Component, Input } from '@angular/core';
import { VerticalAlignmentType, VerticalAlignment, VerticalAlignmentValue, Breakpoint } from 'widgets';
import { BreakpointsComponent } from '../breakpoints/breakpoints.component';

@Component({
  selector: 'breakpoints-vertical-alignment',
  templateUrl: '../breakpoints/breakpoints.component.html',
  styleUrls: ['../breakpoints/breakpoints.component.scss']
})
export class BreakpointsVerticalAlignmentComponent extends BreakpointsComponent<VerticalAlignmentValue, string>  {
  @Input() verticalAlignment!: VerticalAlignment;
  public breakpointOptions: Array<string> = [
    'align-top.png',
    'align-middle.png',
    'align-bottom.png'
  ];




  // --------------------------------------------------------------------- Ng On Init -------------------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    this.title = 'Vertical Alignment';
    this.isImage = true;
  }





  // --------------------------------------------------------------------- Set Value ---------------------------------------------------------
  public setValue(breakpointValue: VerticalAlignmentValue, value: string, direction: number): void {
    breakpointValue.setValue(value);

    super.setValue(breakpointValue, value, direction);
  }




  // -------------------------------------------------------------------- Get Breakpoints ---------------------------------------------------------
  public getBreakpoints(): Array<Breakpoint> {
    if (this.verticalAlignment.values.length == 0) {
      this.verticalAlignment.values.push(new VerticalAlignmentValue(VerticalAlignmentType.Top, 0));
    }

    this.verticalAlignment.values = this.verticalAlignment.values.sort((a, b) => a.breakpoint > b.breakpoint ? 1 : -1);

    const breakpoints: Array<Breakpoint> = new Array<Breakpoint>();

    breakpoints.push({
      label: 'Vertical Alignment',
      values: []
    });

    const breakpoint = breakpoints[0];

    this.verticalAlignment.values.forEach((value: VerticalAlignmentValue) => {
      breakpoint.values.push(value);
    });

    return breakpoints;
  }






  // --------------------------------------------------------------------- Add Breakpoint ---------------------------------------------------------
  public addBreakpoint(breakpoint: number, label?: string): VerticalAlignmentValue {
    let verticalAlignmentType!: VerticalAlignmentType;


    for (let i = this.verticalAlignment.values.length - 1; i > -1; i--) {
      const currentValue = this.verticalAlignment.values[i];

      if (currentValue.breakpoint! < breakpoint) {
        verticalAlignmentType = currentValue.verticalAlignmentType;
        break;
      }
    }

    const verticalAlignmentValue = new VerticalAlignmentValue(verticalAlignmentType, breakpoint);
    this.verticalAlignment.values.push(verticalAlignmentValue);

    return verticalAlignmentValue;
  }





  // --------------------------------------------------------------------- Delete Breakpoint ---------------------------------------------------------
  public deleteBreakpoint(value: VerticalAlignmentValue): void {
    const index = this.verticalAlignment.values.findIndex(x => x == value);

    this.verticalAlignment.values.splice(index, 1);
    if (value.breakpoint == 0) {
      this.verticalAlignment.values[index].breakpoint = 0;
    }
  }



  // ------------------------------------------------------------------------- Can Delete --------------------------------------------------------------
  public canDelete(value: VerticalAlignmentValue): boolean {
    return this.verticalAlignment.values.length > 1;
  }





  // --------------------------------------------------------------------------- Can Add ----------------------------------------------------------------
  public canAdd(breakpoint: number, label?: string): boolean {
    return !this.verticalAlignment.values.some(x => x.breakpoint == breakpoint);
  }
}