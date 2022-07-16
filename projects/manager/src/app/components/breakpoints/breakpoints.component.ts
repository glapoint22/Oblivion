import { AfterViewInit, Directive, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Breakpoint, BreakpointValue } from 'widgets';
import { MenuOptionType } from '../../classes/enums';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Directive()
export abstract class BreakpointsComponent<T1 extends BreakpointValue<T2>, T2> implements OnInit, AfterViewInit {
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('base') base!: ElementRef<HTMLElement>;
  public playheadPosition!: number;
  public breakpointElementWidth!: number;
  public breakpoints!: Array<Breakpoint>;
  public selectedBreakpointValue!: T1;
  public title!: string;
  public abstract breakpointOptions: Array<T2>;
  public isImage!: boolean;
  private contextMenu!: ContextMenuComponent;

  constructor(public breakpointService: BreakpointService, private lazyLoadingService: LazyLoadingService) { }

  // Abstract methods
  public abstract getBreakpoints(): Array<Breakpoint>;
  public abstract addBreakpoint(breakpoint: number, label?: string): T1;
  public abstract deleteBreakpoint(value: T1): void;
  public abstract canDelete(value: T1): boolean;
  public abstract canAdd(breakpoint: number, label?: string): boolean;


  // --------------------------------------------------------------------- Ng On Init ---------------------------------------------------------
  ngOnInit(): void {
    this.breakpoints = this.getBreakpoints();
  }






  // ------------------------------------------------------------------ Ng After View Init ------------------------------------------------------
  ngAfterViewInit() {
    window.setTimeout(() => {
      this.breakpointElementWidth = this.base.nativeElement.getBoundingClientRect().width / this.breakpointService.breakpoints.length;
      this.setPlayheadPosition(this.getBreakpointIndex(this.breakpointService.currentBreakpoint));
    });


    this.breakpointService.$breakpointChange.subscribe(() => {
      this.setPlayheadPosition(this.getBreakpointIndex(this.breakpointService.currentBreakpoint));
    });
  }






  // ---------------------------------------------------------------- Get Breakpoint Left Position -----------------------------------------------
  getBreakpointLeftPosition(breakpoint: number) {
    if (!this.breakpointElementWidth) return 0;
    if (!breakpoint) breakpoint = 0;

    return this.breakpointElementWidth * breakpoint + (this.breakpointElementWidth * 0.5);
  }






  // ---------------------------------------------------------------- Get Breakpoint Right Position ------------------------------------------------
  getBreakpointRightPosition(breakpoint: number) {
    if (!this.breakpointElementWidth) return 0;

    return this.base.nativeElement.getBoundingClientRect().width - (this.breakpointElementWidth * breakpoint + (this.breakpointElementWidth * 0.5))
  }






  // ----------------------------------------------------------------------- On Breakpoint Click ----------------------------------------------------
  onBreakpointClick(breakpointValue: T1) {
    this.selectedBreakpointValue = breakpointValue;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key == 'Escape') {
        this.selectedBreakpointValue = null!;
        document.removeEventListener('keydown', onKeydown);
      }
    }

    document.removeEventListener('keydown', onKeydown);
    document.addEventListener('keydown', onKeydown);
  }






  // ----------------------------------------------------------------------- On Breakpoint Index ----------------------------------------------------
  getBreakpointIndex(breakpoint: string) {
    if (!breakpoint) return 0;
    return this.breakpointService.breakpoints.findIndex(x => x.name == breakpoint);
  }






  // ----------------------------------------------------------------------- Set Playhead Position ----------------------------------------------------
  setPlayheadPosition(index: number) {
    this.playheadPosition = this.breakpointElementWidth * index;
  }






  // ------------------------------------------------------------------------ On Playhead Mousedown ------------------------------------------------------
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







  // ------------------------------------------------------------------------ Set Breakpoint ----------------------------------------------------------
  setBreakpoint(index: number) {
    this.breakpointService.selectedViewPortDimension.value.width = Math.max(240, this.breakpointService.breakpoints[index].min);
    this.breakpointService.setCurrentBreakpoint(this.breakpointService.selectedViewPortDimension.value.width);
    this.setPlayheadPosition(index);
  }





  // --------------------------------------------------------------------- On Breakpoint Name Click -----------------------------------------------------
  onBreakpointNameClick(index: number) {
    if (this.breakpointService.selectedViewPortDimension.key != 'Responsive') return;
    this.setBreakpoint(index);
  }








  // --------------------------------------------------------------------------- On Mousedown --------------------------------------------------------------
  onMousedown(event: MouseEvent, label: string) {
    event.stopPropagation();

    if (this.contextMenu) {
      this.contextMenu.close();
      this.contextMenu = null!;
    }

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
          this.contextMenu = contextMenu;
          contextMenu.xPos = event.clientX;
          contextMenu.yPos = event.clientY
          contextMenu.options = [

            {
              type: MenuOptionType.MenuItem,
              name: 'Add breakpoint',
              optionFunction: () => {
                this.selectedBreakpointValue = this.addBreakpoint(this.getBreakpointIndex(this.breakpointService.currentBreakpoint), label);
                this.breakpoints = this.getBreakpoints();
                this.onChange.emit();
              },
              isDisabled: this.breakpointService.currentBreakpoint == 'mic' ||
                this.breakpointService.currentBreakpoint == 'hd' ||
                !this.canAdd(this.getBreakpointIndex(this.breakpointService.currentBreakpoint), label)
            },
            {
              type: MenuOptionType.MenuItem,
              name: 'Delete breakpoint',
              optionFunction: () => {
                this.deleteBreakpoint(this.selectedBreakpointValue);
                this.breakpoints = this.getBreakpoints();
                this.onChange.emit();
              },
              isDisabled: !this.selectedBreakpointValue || !this.canDelete(this.selectedBreakpointValue)
            }
          ];
        });
    }
  }



  // --------------------------------------------------------------------- Set Value ---------------------------------------------------------
  public setValue(breakpointValue: T1, value: T2, direction: number): void {
    this.onChange.emit();
  }







  // --------------------------------------------------------------------- OnArrow Click ---------------------------------------------------------
  onArrowClick(direction: number, breakpointValue: T1) {
    const index = this.breakpointOptions.findIndex(x => x == breakpointValue.getValue());
    let value: T2;

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

    this.setValue(breakpointValue, value, direction);
  }
}