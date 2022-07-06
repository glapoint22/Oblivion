import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Breakpoint, BreakpointObject } from 'widgets';
import { MenuOptionType } from '../../classes/enums';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Component({
  selector: 'breakpoints',
  templateUrl: './breakpoints.component.html',
  styleUrls: ['./breakpoints.component.scss']
})
export class BreakpointsComponent implements AfterViewInit, OnChanges {
  @Input() breakpointObject!: BreakpointObject;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('breakpointsBase') base!: ElementRef<HTMLElement>;
  public playheadPosition!: number;
  public breakpointElementWidth!: number;
  public breakpoints!: Array<Breakpoint>;
  public selectedBreakpoint!: any;

  constructor(public breakpointService: BreakpointService, private lazyLoadingService: LazyLoadingService) { }


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




  getLeftPosition(breakpoint: number) {
    if (!this.breakpointElementWidth) return 0;
    if (!breakpoint) breakpoint = 0;

    return this.breakpointElementWidth * breakpoint + (this.breakpointElementWidth * 0.5);
  }


  getRightPosition(breakpoint: number) {
    if (!this.breakpointElementWidth) return 0;

    return this.base.nativeElement.getBoundingClientRect().width - (this.breakpointElementWidth * breakpoint + (this.breakpointElementWidth * 0.5))
  }


  onBreakpointClick(breakpointValue: any) {
    this.selectedBreakpoint = breakpointValue;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key == 'Escape') {
        this.selectedBreakpoint = null;
        document.removeEventListener('keydown', onKeydown);
      }
    }

    document.removeEventListener('keydown', onKeydown);
    document.addEventListener('keydown', onKeydown);
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



  onMousedown(event: MouseEvent, label: string) {
    if (event.button == 2) {
      this.lazyLoadingService.load(async () => {
        const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
        const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

        return {
          component: ContextMenuComponent,
          module: ContextMenuModule
        }
      }, SpinnerAction.None)
        .then((contextMenu: ContextMenuComponent) => {
          contextMenu.xPos = event.clientX;
          contextMenu.yPos = event.clientY
          contextMenu.options = [

            {
              type: MenuOptionType.MenuItem,
              name: 'Add breakpoint',
              optionFunction: () => {
                this.selectedBreakpoint = this.breakpointObject.addBreakpoint(this.getBreakpointIndex(this.breakpointService.currentBreakpoint), label);
                this.breakpoints = this.breakpointObject.getBreakpoints();
                this.onChange.emit();
              },
              isDisabled: this.breakpointService.currentBreakpoint == 'mic' || this.breakpointService.currentBreakpoint == 'hd' || !this.breakpointObject.canAdd(this.getBreakpointIndex(this.breakpointService.currentBreakpoint), label)
            },
            {
              type: MenuOptionType.MenuItem,
              name: 'Delete breakpoint',
              optionFunction: () => {
                this.breakpointObject.deleteBreakpoint(this.selectedBreakpoint);
                this.breakpoints = this.breakpointObject.getBreakpoints();
                this.onChange.emit();
              },
              isDisabled: !this.selectedBreakpoint || !this.breakpointObject.canDelete(this.selectedBreakpoint)
            }
          ];
        });
    }
  }
}