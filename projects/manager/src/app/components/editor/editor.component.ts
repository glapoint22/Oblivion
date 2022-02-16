import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SelectedWidgetIcon } from '../../classes/selected-widget-icon';
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


  ngAfterViewInit() {
    this.iframe.nativeElement.src = 'viewport';

    this.iframe.nativeElement.onload = () => {
      const _window = this.iframe.nativeElement.contentWindow as any;

      this.widgetService = _window.widgetService;

      this.widgetService.$selectedWidgetIcon.subscribe((selectedWidgetIcon: SelectedWidgetIcon) => {
        document.body.style.cursor = selectedWidgetIcon.cursor;
      });
    }
  }


  onIconMousedown(widgetCursor: WidgetCursor) {
    const cursor: string = this.widgetService.getCursor(widgetCursor);

    this.widgetService.$selectedWidgetIcon.next({
      widgetType: widgetCursor.widgetType,
      cursor: 'url(' + cursor + '), auto'
    });
  }
}