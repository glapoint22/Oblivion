import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Breakpoint, BreakpointObject } from 'widgets';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Component({
  selector: 'breakpoints',
  templateUrl: './breakpoints.component.html',
  styleUrls: ['./breakpoints.component.scss']
})
export class BreakpointsComponent implements AfterViewInit, OnChanges {
  @Input() breakpointObject!: BreakpointObject;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('base') base!: ElementRef<HTMLElement>;
  public playheadPosition!: number;
  public breakpointElementWidth!: number;
  public breakpoints!: Array<Breakpoint>;
  public selectedBreakpoint!: any;

  constructor(public breakpointService: BreakpointService) { }


  ngOnChanges(): void {
    this.breakpoints = this.breakpointObject.getBreakpoints();
  }


  ngAfterViewInit() {
    window.setTimeout(() => {
      this.breakpointElementWidth = this.base.nativeElement.getBoundingClientRect().width / this.breakpointService.breakpoints.length;
      this.setPlayheadPosition(this.getBreakpointIndex(this.breakpointService.currentBreakpoint));
    });


    this.breakpointService.$breakpointChange.subscribe(() => {
      this.setPlayheadPosition(this.getBreakpointIndex(this.breakpointService.currentBreakpoint));
    });
  }


  addBreakpoint() {
    this.selectedBreakpoint = this.breakpointObject.addBreakpoint(this.getBreakpointIndex(this.breakpointService.currentBreakpoint));
    this.breakpoints = this.breakpointObject.getBreakpoints();
    this.onChange.emit();
  }


  deleteBreakpoint() {
    this.breakpointObject.deleteBreakpoint(this.selectedBreakpoint);
    this.breakpoints = this.breakpointObject.getBreakpoints();
    this.onChange.emit();
  }


  getLeftPosition(breakpoint: number) {
    if (!this.breakpointElementWidth) return 0;
    // const index = this.getBreakpointIndex(breakpoint);

    return this.breakpointElementWidth * breakpoint + (this.breakpointElementWidth * 0.5);
  }


  getRightPosition(breakpoint: number) {
    if (!this.breakpointElementWidth) return 0;
    // const index = this.getBreakpointIndex(breakpoint);

    return this.base.nativeElement.getBoundingClientRect().width - (this.breakpointElementWidth * breakpoint + (this.breakpointElementWidth * 0.5))
  }


  


  getBreakpointIndex(breakpoint: string) {
    if (!breakpoint) return 0;
    return this.breakpointService.breakpoints.findIndex(x => x.name == breakpoint);
  }


  setPlayheadPosition(index: number) {
    this.playheadPosition = this.breakpointElementWidth * index;
  }


  onPlayheadMousedown(mousedownEvent: MouseEvent) {
    if (this.breakpointService.selectedViewPortDimension.key != 'Responsive') return;

    const playhead = mousedownEvent.target as HTMLElement;
    let playheadLeft = playhead.getBoundingClientRect().left;

    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const delta = mousemoveEvent.movementX;
      const baseRect = this.base.nativeElement.getBoundingClientRect();

      playheadLeft += delta;
      const newLeft = playheadLeft - baseRect.left;
      const fraction = (newLeft / baseRect.width) * 10;
      const index = Math.min(Math.max(0, Math.floor(fraction)), this.breakpointService.breakpoints.length - 1);

      this.setBreakpoint(index);
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
  }


  setBreakpoint(index: number) {
    this.breakpointService.selectedViewPortDimension.value.width = Math.max(240, this.breakpointService.breakpoints[index].min);
    this.breakpointService.setCurrentBreakpoint(this.breakpointService.selectedViewPortDimension.value.width);
    this.setPlayheadPosition(index);
  }


  onBreakpointNameClick(index: number) {
    if (this.breakpointService.selectedViewPortDimension.key != 'Responsive') return;
    this.setBreakpoint(index);
  }


  
}