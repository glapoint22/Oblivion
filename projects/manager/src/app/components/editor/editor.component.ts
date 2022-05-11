import { Compiler, Component, ComponentFactoryResolver, ComponentRef, Injector, NgModuleFactory, ViewContainerRef } from '@angular/core';
import { WidgetCursor } from '../../classes/widget-cursor';
import { WidgetService } from '../../services/widget/widget.service';
import { PageDevComponent } from '../page-dev/page-dev.component';
import { PageDevModule } from '../page-dev/page-dev.module';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  public page!: PageDevComponent;
  public showResizeCover!: boolean;
  public document = document;
  public widgetCursors = WidgetCursor.getWidgetCursors();

  constructor
    (
      public widgetService: WidgetService,
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
    this.widgetService.widgetDocument = iframeContentDocument;
    iframeContentDocument.head.innerHTML = document.head.innerHTML;
    iframeContentDocument.body.appendChild(componentRef.location.nativeElement);
  }


  onIconMousedown(widgetCursor: WidgetCursor) {
    this.widgetService.setWidgetCursor(widgetCursor);

    window.addEventListener('mouseup', () => {
      this.widgetService.clearWidgetCursor();
    }, { once: true });
  }



  onResizeMousedown(editorWindow: HTMLElement, direction?: number) {
    // Assign the resize cursor
    if (direction) {
      document.body.style.cursor = 'e-resize'
    } else {
      document.body.style.cursor = 's-resize';
    }

    this.showResizeCover = true;

    const onResizeMousemove = (mousemoveEvent: MouseEvent) => {
      const minSize = 240;
      const maxSize = 1600;

      // Size the editor window
      if (direction) {
        const width = Math.min(Math.max(minSize, editorWindow.clientWidth + mousemoveEvent.movementX * 2 * (direction as number)), maxSize);
        editorWindow.style.width = width + 'px';

      } else {
        const height = Math.max(minSize, editorWindow.clientHeight + mousemoveEvent.movementY);
        editorWindow.style.height = height + 'px';
      }
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
}