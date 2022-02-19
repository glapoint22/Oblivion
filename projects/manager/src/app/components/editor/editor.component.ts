import { AfterViewInit, ApplicationRef, Component, ElementRef, ViewChild } from '@angular/core';
import { WidgetCursor } from '../../classes/widget-cursor';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public widgetService!: WidgetService;
  public showResizeCover!: boolean;
  public document = document;

  constructor(private appRef: ApplicationRef) { }


  ngAfterViewInit() {
    // Set the iframe src
    this.iframe.nativeElement.src = 'viewport';


    this.iframe.nativeElement.onload = () => {
      const _window = this.iframe.nativeElement.contentWindow as any;

      // This widget service is from the viewport in the iframe
      this.widgetService = _window.widgetService;

      // Subscribe to widget cursor changes
      this.widgetService.$widgetCursor.subscribe((widgetCursor: WidgetCursor) => {
        document.body.style.cursor = widgetCursor.cursor;
        this.appRef.tick();

        if (widgetCursor.cursor == 'default') {
          window.removeEventListener('mouseup', this.onMouseup);
        }
      });
    }
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