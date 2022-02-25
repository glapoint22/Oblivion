import { AfterViewInit, ApplicationRef, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { WidgetCursor } from '../../classes/widget-cursor';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  @ViewChild('widgetInspectorContainer', { read: ViewContainerRef }) widgetInspectorContainer!: ViewContainerRef;
  public widgetService!: WidgetService;
  public showResizeCover!: boolean;
  public document = document;

  constructor(private appRef: ApplicationRef, private lazyLoadingService: LazyLoadingService) { }


  ngAfterViewInit() {
    // Set the iframe src
    this.iframe.nativeElement.src = 'viewport';


    this.iframe.nativeElement.onload = () => {
      const contentWindow = this.iframe.nativeElement.contentWindow as any;

      // This widget service is from the viewport in the iframe
      this.widgetService = (window as any).widgetService = contentWindow.widgetService;

      this.loadWidgetInspector();

      // Subscribe to widget cursor changes
      this.widgetService.$widgetCursor.subscribe((widgetCursor: WidgetCursor) => {
        document.body.style.cursor = widgetCursor.cursor;
        this.appRef.tick();

        if (widgetCursor.cursor == 'default') {
          window.removeEventListener('mouseup', this.onMouseup);
        }
      });

      this.widgetService.$widgetResize.subscribe((resizeCursor: string) => {
        this.showResizeCover = resizeCursor != 'default' ? true : false;
        document.body.style.cursor = resizeCursor;
        this.appRef.tick();
      });
    }
  }

  async loadWidgetInspector() {
    this.lazyLoadingService.load(async () => {
      const { WidgetInspectorComponent } = await import('../widget-inspector/widget-inspector.component');
      const { WidgetInspectorModule } = await import('../widget-inspector/widget-inspector.module');

      

      return {
        component: WidgetInspectorComponent,
        module: WidgetInspectorModule
      }
    }, SpinnerAction.None, this.widgetInspectorContainer);
  }


  onIconMousedown(widgetCursor: WidgetCursor) {
    this.widgetService.setWidgetCursor(widgetCursor);
    window.addEventListener('mouseup', this.onMouseup);
  }


  onMouseup = () => {
    this.widgetService.clearWidgetCursor();
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
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', onResizeMousemove);
      window.removeEventListener('mouseup', onResizeMouseUp);
    }

    window.addEventListener('mousemove', onResizeMousemove);
    window.addEventListener('mouseup', onResizeMouseUp);
  }
}