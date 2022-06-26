import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Padding, PaddingType, PaddingValue } from 'widgets';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Component({
  selector: 'padding',
  templateUrl: './padding.component.html',
  styleUrls: ['./padding.component.scss']
})
export class PaddingComponent {
  @Input() padding!: Padding;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  // public paddingType = PaddingType;
  // public paddingTop: number = 0;
  // public paddingRight: number = 0;
  // public paddingBottom: number = 0;
  // public paddingLeft: number = 0;
  // public paddingTopChecked: boolean = false;
  // public paddingRightChecked: boolean = false;
  // public paddingBottomChecked: boolean = false;
  // public paddingLeftChecked: boolean = false;
  // public spacing: Array<number> = [
  //   0,
  //   4,
  //   8,
  //   12,
  //   16,
  //   20,
  //   24,
  //   28,
  //   32,
  //   36,
  //   40,
  //   44,
  //   48
  // ]


  // constructor(private breakpointService: BreakpointService) { }


  // ngOnInit(): void {
  //   // Subscribe to breakpoint changes
  //   this.breakpointService.$breakpointChange.subscribe(() => {
  //     this.setBreakpoints();
  //   });
  // }


  // ngOnChanges() {
  //   const paddingTypes = this.padding.values.map(x => x.paddingType).filter((v, i, a) => a.indexOf(v) === i);

  //   paddingTypes.forEach((paddingType: string) => {
  //     const paddingValue = this.padding.values.find(x => x.paddingType == paddingType && !x.breakpoint);

  //     if (paddingValue) this.setPaddingProperty(paddingType, paddingValue.padding);
  //   });

  //   this.setBreakpoints();
  // }


  // setBreakpoints() {
  //   const paddingTypes = this.padding.values.map(x => x.paddingType).filter((v, i, a) => a.indexOf(v) === i);

  //   paddingTypes.forEach((paddingType: string) => {
  //     const paddingValues = this.padding.values.filter(x => x.paddingType == paddingType);
  //     const breakpoints = this.breakpointService.getBreakpoints(paddingValues.map(x => x.breakpoint as string));

  //     if (breakpoints) {
  //       if (paddingValues.some(x => breakpoints.includes(x.breakpoint as string))) {
  //         const breakpoint = this.breakpointService.getBreakpoint(paddingValues.map(x => x.breakpoint as string));

  //         this.setPaddingProperty(paddingType, this.padding.values.find(x => x.breakpoint == breakpoint)?.padding as number);
  //         this.setCheckbox(paddingType, true);
  //         return;
  //       }
  //     }

  //     const value = paddingValues.find(x => !x.breakpoint);
  //     this.setPaddingProperty(paddingType, value ? value.padding : 0);
  //     this.setCheckbox(paddingType, false);
  //   });

  // }


  // setPaddingProperty(paddingType: string, padding: number) {
  //   if (paddingType == PaddingType.Top) this.paddingTop = padding;
  //   if (paddingType == PaddingType.Right) this.paddingRight = padding;
  //   if (paddingType == PaddingType.Bottom) this.paddingBottom = padding;
  //   if (paddingType == PaddingType.Left) this.paddingLeft = padding;
  // }

  // setCheckbox(paddingType: string, checked: boolean) {
  //   if (paddingType == PaddingType.Top) this.paddingTopChecked = checked;
  //   if (paddingType == PaddingType.Right) this.paddingRightChecked = checked;
  //   if (paddingType == PaddingType.Bottom) this.paddingBottomChecked = checked;
  //   if (paddingType == PaddingType.Left) this.paddingLeftChecked = checked;
  // }


  // setPadding(paddingType: string, padding: number) {
  //   const paddingValues = this.padding.values.filter(x => x.paddingType == paddingType);
  //   let paddingValue: PaddingValue | undefined;

  //   if (paddingValues.length > 0) {
  //     const breakpoint = this.breakpointService.getBreakpoint(paddingValues.map(x => x.breakpoint as string));
  //     paddingValue = this.padding.values.find(x => x.paddingType == paddingType && x.breakpoint == breakpoint);

  //     if (paddingValue && this.breakpointService.currentBreakpoint == breakpoint) {
  //       paddingValue.padding = padding;
  //     } else {
  //       paddingValue = new PaddingValue(paddingType, padding, breakpoint ? this.breakpointService.currentBreakpoint : undefined);
  //       this.padding.values.push(paddingValue);
  //     }
  //   } else {
  //     paddingValue = new PaddingValue(paddingType, padding);
  //     this.padding.values.push(paddingValue);
  //   }
  // }

  // onValueChange(paddingType: string, padding: number) {
  //   if (this.padding.constrain) {
  //     const paddingTypes = Object.values(PaddingType);

  //     paddingTypes.forEach((paddingType: string) => {
  //       this.setPadding(paddingType, padding);

  //       this.paddingTop = this.paddingRight = this.paddingBottom = this.paddingLeft = padding;
  //     });
  //   } else {
  //     this.setPadding(paddingType, padding);

  //     this.setPaddingProperty(paddingType, padding);
  //   }

  //   this.onChange.emit();
  // }


  // onConstrainChange() {
  //   this.padding.constrain = !this.padding.constrain;
  //   this.onChange.emit();
  // }


  // onBreakpointCheckboxChange(breakpointCheckbox: HTMLInputElement, paddingType: string) {
  //   if (breakpointCheckbox.checked) {
  //     let paddingValue = this.padding.values.find(x => x.paddingType == paddingType && x.breakpoint == undefined);

  //     if (paddingValue) {
  //       paddingValue.breakpoint = this.breakpointService.currentBreakpoint;
  //     } else {
  //       paddingValue = new PaddingValue(paddingType, 0, this.breakpointService.currentBreakpoint);
  //       this.padding.values.push(paddingValue);
  //     }
  //   } else {
  //     const paddingValues = this.padding.values.filter(x => x.paddingType == paddingType);
  //     let breakpoint = this.breakpointService.getBreakpoint(paddingValues.map(x => x.breakpoint as string));
  //     let paddingValue = this.padding.values.find(x => x.paddingType == paddingType && x.breakpoint == breakpoint);

  //     if (paddingValue) {
  //       paddingValue.breakpoint = undefined;
  //       breakpoint = this.breakpointService.getBreakpoint(paddingValues.map(x => x.breakpoint as string));

  //       if (breakpoint) {
  //         breakpointCheckbox.checked = true;
  //         this.setPaddingProperty(paddingType, paddingValues.find(x => x.breakpoint == breakpoint)?.padding as number);
  //       }

  //       const index = paddingValues.findIndex(x => !x.breakpoint && x != paddingValue);

  //       if (index != -1) {
  //         this.padding.values.splice(index, 1);
  //       }
  //     }
  //   }

  //   this.setCheckbox(paddingType, breakpointCheckbox.checked);

  //   this.onChange.emit();
  // }
}