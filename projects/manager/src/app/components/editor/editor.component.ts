import { Compiler, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, NgModuleFactory, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerHost } from '../../classes/container-host';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { WidgetService } from '../../services/widget/widget.service';
import { PageDevComponent } from '../page-dev/page-dev.component';
import { PageDevModule } from '../page-dev/page-dev.module';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements ContainerHost {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public page!: PageDevComponent;
  public showResizeCover!: boolean;
  public document = document;
  public widgetCursors = WidgetCursor.getWidgetCursors();
  public widgetInspectorView = WidgetInspectorView;


  constructor
    (
      public widgetService: WidgetService,
      public breakpointService: BreakpointService,
      private viewContainerRef: ViewContainerRef,
      private resolver: ComponentFactoryResolver,
      private compiler: Compiler,
      private injector: Injector
    ) { }




  onLoad(iframe: HTMLIFrameElement) {
    const iframeContentDocument = iframe.contentDocument!;
    const compFactory = this.resolver.resolveComponentFactory(PageDevComponent);
    const moduleFactory: NgModuleFactory<PageDevModule> = this.compiler.compileModuleSync(PageDevModule);
    const moduleRef = moduleFactory.create(this.injector);
    const componentRef: ComponentRef<PageDevComponent> = this.viewContainerRef.createComponent(compFactory, undefined, moduleRef.injector);

    this.page = componentRef.instance;
    this.page.host = this;
    this.widgetService.widgetDocument = iframeContentDocument;
    iframeContentDocument.head.innerHTML = document.head.innerHTML;
    iframeContentDocument.body.appendChild(componentRef.location.nativeElement);

    iframeContentDocument.addEventListener('mousedown', () => window.dispatchEvent(new Event('mousedown')));
    iframeContentDocument.addEventListener('keydown', (event: KeyboardEvent) => window.dispatchEvent(new KeyboardEvent('keydown', event)));
  }


  onIconMousedown(widgetCursor: WidgetCursor) {
    this.widgetService.setWidgetCursor(widgetCursor);

    window.addEventListener('mouseup', () => {
      this.widgetService.clearWidgetCursor();
    }, { once: true });
  }



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




  onInputEnter(widthValue: string, heightValue: string) {
    this.breakpointService.selectedViewPortDimension.value.width = parseInt(widthValue);
    this.breakpointService.selectedViewPortDimension.value.height = parseInt(heightValue);
    this.breakpointService.setCurrentBreakpoint(this.breakpointService.selectedViewPortDimension.value.width);
  }

  onRowChange(maxBottom: number): void {
    if (this.breakpointService.selectedViewPortDimension.key == 'Responsive' && maxBottom > this.breakpointService.selectedViewPortDimension.value.height - 4) {
      this.breakpointService.selectedViewPortDimension.value.height = maxBottom + 4;
    }
  }
}