import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Component({
  selector: 'breakpoints',
  templateUrl: './breakpoints.component.html',
  styleUrls: ['./breakpoints.component.scss']
})
export class BreakpointsComponent implements AfterViewInit {
  @ViewChild('base') base!: ElementRef<HTMLElement>;
  public playheadPosition!: number;
  public breakpointElementWidth!: number;

  constructor(public breakpointService: BreakpointService) { }


  ngAfterViewInit() {
    this.breakpointElementWidth = this.base.nativeElement.getBoundingClientRect().width / this.breakpointService.breakpoints.length;

    window.setTimeout(() => {
      this.setPlayheadPosition(this.breakpointService.breakpoints.findIndex(x => x.name == this.breakpointService.currentBreakpoint));
    });


    this.breakpointService.$breakpointChange.subscribe(() => {
      this.setPlayheadPosition(this.breakpointService.breakpoints.findIndex(x => x.name == this.breakpointService.currentBreakpoint));
    });

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


  onBreakpointClick(index: number) {
    if (this.breakpointService.selectedViewPortDimension.key != 'Responsive') return;
    this.setBreakpoint(index);
  }
}