import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Widget } from 'widgets';
import { WidgetCursorType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { ColumnDevComponent } from '../../components/column-dev/column-dev.component';
import { ContainerDevComponent } from '../../components/container-dev/container-dev.component';
import { RowDevComponent } from '../../components/row-dev/row-dev.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  public $onContainerMousemove: Subject<ContainerDevComponent> = new Subject<ContainerDevComponent>();
  public selectedRow!: RowDevComponent;
  public selectedColumn!: ColumnDevComponent;
  public selectedWidget!: Widget;
  public widgetCursor!: WidgetCursor;
  public widgetDocument!: Document;


  // ------------------------------------------------------------------------Set Widget Cursor------------------------------------------------------------
  public setWidgetCursor(widgetCursor: WidgetCursor): void {
    this.widgetCursor = widgetCursor;
    document.body.style.cursor = widgetCursor.getCursor();
    this.widgetDocument.body.style.cursor = widgetCursor.getCursor();
    this.widgetDocument.body.id = 'widget-cursor';
  }



  // ------------------------------------------------------------------------Set Widget Cursor Type------------------------------------------------------------
  setWidgetCursorType(widgetCursorType: WidgetCursorType): void {
    this.widgetDocument.body.style.cursor = this.widgetCursor.getCursor(widgetCursorType);
  }



  // ------------------------------------------------------------------------Clear Widget Cursor------------------------------------------------------------
  public clearWidgetCursor(): void {
    document.body.style.cursor = '';
    this.widgetDocument.body.style.cursor = '';
    this.widgetDocument.body.id = '';
    this.widgetCursor = null!;
  }
}