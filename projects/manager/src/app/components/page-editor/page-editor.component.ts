import { Compiler, Component, ComponentFactoryResolver, ComponentRef, Injector, NgModuleFactory, ViewContainerRef } from '@angular/core';
import { DropdownType } from 'common';
import { Editor } from '../../classes/editor';
import { BuilderType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';
import { WidgetService } from '../../services/widget/widget.service';
import { PageDevComponent } from '../page-dev/page-dev.component';
import { PageDevModule } from '../page-dev/page-dev.module';

@Component({
  selector: 'page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent extends Editor<PageDevComponent> {
  public page!: PageDevComponent;
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


  // ---------------------------------------- Get Component Ref ----------------------------------------
  public getComponentRef(): ComponentRef<PageDevComponent> {
    const compFactory = this.resolver.resolveComponentFactory(PageDevComponent);
    const moduleFactory: NgModuleFactory<PageDevModule> = this.compiler.compileModuleSync(PageDevModule);
    const moduleRef = moduleFactory.create(this.injector);
    return this.viewContainerRef.createComponent(compFactory, undefined, moduleRef.injector);
  }




  // ---------------------------------------- Set Page ----------------------------------------
  public setPage(componentRef: ComponentRef<PageDevComponent>): void {
    this.page = componentRef.instance;
    this.page.host = this;
    this.widgetService.page = this.page;
    this.page.builderType = BuilderType.Page;
    this.page.apiUrl = 'api/Pages';
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