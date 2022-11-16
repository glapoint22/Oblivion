import { Compiler, Component, ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { DropdownType } from 'common';
import { Editor } from '../../classes/editor';
import { BuilderType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent extends Editor {
  public widgetCursors = WidgetCursor.getWidgetCursors(BuilderType.Page);
  public showResizeCover!: boolean;
  public DropdownType = DropdownType;

  constructor
    (
      widgetService: WidgetService,
      viewContainerRef: ViewContainerRef,
      resolver: ComponentFactoryResolver,
      compiler: Compiler,
      injector: Injector,
      public breakpointService: BreakpointService
    ) {
    super(widgetService,
      viewContainerRef,
      resolver,
      compiler,
      injector);
  }


  
  onLoad(iframe: HTMLIFrameElement): void {
    super.onLoad(iframe);

    this.page.builderType = BuilderType.Page;
  }

  



  // ---------------------------------------- On Input Enter ----------------------------------------
  onInputEnter(widthValue: string, heightValue: string) {
    this.breakpointService.selectedViewPortDimension.value.width = parseInt(widthValue);
    this.breakpointService.selectedViewPortDimension.value.height = parseInt(heightValue);
    this.breakpointService.setCurrentBreakpoint(this.breakpointService.selectedViewPortDimension.value.width);
  }





  // -------------------------------------- On Resize Mousedown -------------------------------------
  onResizeMousedown(direction?: number) {
    // Assign the resize cursor
    if (direction) {
      document.body.style.cursor = 'e-resize'
    } else {
      document.body.style.cursor = 's-resize';
    }

    this.showResizeCover = true;

    const onResizeMousemove = (mousemoveEvent: MouseEvent) => {


      // Size the editor window
      if (direction) {
        const minSize = 240;
        const maxSize = 1600;
        const width = Math.min(Math.max(minSize, this.breakpointService.selectedViewPortDimension.value.width + mousemoveEvent.movementX * 2 * (direction as number)), maxSize);

        this.breakpointService.selectedViewPortDimension.value.width = width;

      }
      else {
        const minSize = 240;
        const maxSize = window.innerHeight - 71;
        const height = Math.min(Math.max(minSize, this.breakpointService.selectedViewPortDimension.value.height + mousemoveEvent.movementY), maxSize);

        this.breakpointService.selectedViewPortDimension.value.height = height;
      }

      this.breakpointService.setCurrentBreakpoint(this.breakpointService.selectedViewPortDimension.value.width);
    }

    const onResizeMouseUp = () => {
      this.showResizeCover = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onResizeMousemove);
      window.removeEventListener('mouseup', onResizeMouseUp);
    }

    window.addEventListener('mousemove', onResizeMousemove);
    window.addEventListener('mouseup', onResizeMouseUp);
  }






  // -------------------------------------- On Row Change -------------------------------------
  onRowChange(maxBottom: number): void {
    if (this.breakpointService.selectedViewPortDimension.key == 'Responsive' && maxBottom > this.breakpointService.selectedViewPortDimension.value.height - 4) {
      this.breakpointService.selectedViewPortDimension.value.height = maxBottom + 4;
    }
  }
}