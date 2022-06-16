import { Compiler, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, NgModuleFactory, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerHost } from '../../classes/container-host';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { WidgetService } from '../../services/widget/widget.service';
import { ContainerDevComponent } from '../container-dev/container-dev.component';
import { PageDevComponent } from '../page-dev/page-dev.component';
import { PageDevModule } from '../page-dev/page-dev.module';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements ContainerHost {
  @ViewChild('editorWindow') editorWindow!: ElementRef<HTMLElement>;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public page!: PageDevComponent;
  public showResizeCover!: boolean;
  public document = document;
  public widgetCursors = WidgetCursor.getWidgetCursors();
  public windowWidth = 1600;
  public windowHeight = 900;
  private fixedHeight = this.windowHeight;
  public widgetInspectorView = WidgetInspectorView;

  constructor
    (
      public widgetService: WidgetService,
      private viewContainerRef: ViewContainerRef,
      private resolver: ComponentFactoryResolver,
      private compiler: Compiler,
      private injector: Injector
    ) { }

    
    ngAfterViewInit() {
      this.editorWindow.nativeElement.style.width = this.windowWidth + 'px';
      this.editorWindow.nativeElement.style.height = this.windowHeight + 'px';
    }


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
  }


  onIconMousedown(widgetCursor: WidgetCursor) {
    this.widgetService.setWidgetCursor(widgetCursor);

    window.addEventListener('mouseup', () => {
      this.widgetService.clearWidgetCursor();
    }, { once: true });
  }



  onResizeMousedown(editorWindow: HTMLElement, direction?: number) {
    const container = this.page.container as ContainerDevComponent;
    const minSize = Math.max(240, container.rows && container.rows.length > 0 ? container.rows.map(x => x.rowElement.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b)) + 144 : 0);
    const maxSize = 1600;


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
        const width = Math.min(Math.max(minSize, editorWindow.clientWidth + mousemoveEvent.movementX * 2 * (direction as number)), maxSize);
        editorWindow.style.width = width + 'px';

      } else {
        this.windowHeight = Math.max(minSize, editorWindow.clientHeight + mousemoveEvent.movementY);
        this.fixedHeight = this.windowHeight;
        editorWindow.style.height = this.windowHeight + 'px';
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




  onRowChange(maxBottom: number): void {
    const height = Math.max(this.fixedHeight, maxBottom + 148);
    const scroll = height > this.editorWindow.nativeElement.clientHeight;

    this.editorWindow.nativeElement.style.height = height + 'px';

    if (scroll)
      this.editorWindow.nativeElement.parentElement?.scrollTo(0, this.editorWindow.nativeElement.parentElement.scrollHeight);
  }
}