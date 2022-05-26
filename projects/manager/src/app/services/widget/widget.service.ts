import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HorizontalAlignmentType, VerticalAlignmentType, Widget, WidgetType } from 'widgets';
import { WidgetCursorType, WidgetHandle } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { ColumnDevComponent } from '../../components/column-dev/column-dev.component';
import { ContainerDevComponent } from '../../components/container-dev/container-dev.component';
import { RowDevComponent } from '../../components/row-dev/row-dev.component';
import { BreakpointService } from '../breakpoint/breakpoint.service';

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
  public widgetHandleMove!: boolean;


  constructor(private breakpointService: BreakpointService) { }


  // ------------------------------------------------------------------------Set Widget Cursor------------------------------------------------------------
  public setWidgetCursor(widgetCursor: WidgetCursor): void {
    this.widgetCursor = widgetCursor;
    document.body.style.cursor = widgetCursor.getCursor();
    this.widgetDocument.body.style.cursor = widgetCursor.getCursor();
    this.widgetDocument.body.id = 'widget-cursor';
  }



  // ------------------------------------------------------------------------Set Widget Cursor Type------------------------------------------------------------
  public setWidgetCursorType(widgetCursorType: WidgetCursorType): void {
    this.widgetDocument.body.style.cursor = this.widgetCursor.getCursor(widgetCursorType);
  }



  // ------------------------------------------------------------------------Clear Widget Cursor------------------------------------------------------------
  public clearWidgetCursor(): void {
    document.body.style.cursor = '';
    this.widgetDocument.body.style.cursor = '';
    this.widgetDocument.body.id = '';
    this.widgetCursor = null!;
  }




  // ----------------------------------------------------------------------On Widget Handle Mousedown---------------------------------------------------------
  public onWidgetHandleMousedown(widgetHandle: WidgetHandle, mousedownEvent: MouseEvent) {
    this.widgetHandleMove = true;

    switch (widgetHandle) {
      // Top Left
      case WidgetHandle.TopLeft:
        if (this.selectedWidget.type == WidgetType.Image || this.selectedWidget.type == WidgetType.Video) {
          this.onCornerWidgetHandleMousedown(mousedownEvent, WidgetHandle.TopLeft);
        } else {
          this.onTopWidgetHandleMousedown(mousedownEvent);
          this.onLeftWidgetHandleMousedown(mousedownEvent);
        }

        break;

      // Top
      case WidgetHandle.Top:
        this.onTopWidgetHandleMousedown(mousedownEvent);
        break;


      // Top Right
      case WidgetHandle.TopRight:
        if (this.selectedWidget.type == WidgetType.Image || this.selectedWidget.type == WidgetType.Video) {
          this.onCornerWidgetHandleMousedown(mousedownEvent, WidgetHandle.TopRight);
        } else {
          this.onTopWidgetHandleMousedown(mousedownEvent);
          this.onRightWidgetHandleMousedown(mousedownEvent);
        }
        break;

      // Right
      case WidgetHandle.Right:
        this.onRightWidgetHandleMousedown(mousedownEvent);
        break;


      // Bottom Right
      case WidgetHandle.BottomRight:
        if (this.selectedWidget.type == WidgetType.Image || this.selectedWidget.type == WidgetType.Video) {
          this.onCornerWidgetHandleMousedown(mousedownEvent, WidgetHandle.BottomRight);
        } else {
          this.onBottomWidgetHandleMousedown(mousedownEvent);
          this.onRightWidgetHandleMousedown(mousedownEvent);
        }

        break;


      // Bottom
      case WidgetHandle.Bottom:
        this.onBottomWidgetHandleMousedown(mousedownEvent);
        break;


      // Bottom Left
      case WidgetHandle.BottomLeft:
        if (this.selectedWidget.type == WidgetType.Image || this.selectedWidget.type == WidgetType.Video) {
          this.onCornerWidgetHandleMousedown(mousedownEvent, WidgetHandle.BottomLeft);
        } else {
          this.onBottomWidgetHandleMousedown(mousedownEvent);
          this.onLeftWidgetHandleMousedown(mousedownEvent);
        }

        break;


      // Left
      case WidgetHandle.Left:
        this.onLeftWidgetHandleMousedown(mousedownEvent);
        break;
    }
  }


  onCornerWidgetHandleMousedown(mousedownEvent: MouseEvent, widgetHandle: WidgetHandle) {
    const document = this.widgetDocument;
    const column = this.selectedColumn;
    const widget = this.selectedWidget;
    let breakpoint = this.breakpointService.getBreakpoint(widget.horizontalAlignment.values.map(x => x.breakpoint as string));
    const horizontalAlignmentValue = widget.horizontalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const horizontalAlignmentType = horizontalAlignmentValue ? horizontalAlignmentValue.horizontalAlignmentType : HorizontalAlignmentType.Left;
    const row = this.selectedRow;
    breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint as string));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rect = widget.widgetElement.getBoundingClientRect();
    const startWidth = rect.width;
    const startHeight = rect.height;
    let width = startWidth;
    let height = startHeight;
    const rowHeight = this.getRowHeight();
    const aspectRatio = widget.widgetElement.getBoundingClientRect().height / widget.widgetElement.getBoundingClientRect().width;
    

    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = widget.height;

      switch (widgetHandle) {
        case WidgetHandle.TopLeft:
          width -= mousemoveEvent.movementX * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
          height -= mousemoveEvent.movementY * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);
          break;


        case WidgetHandle.TopRight:
          width += mousemoveEvent.movementX * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
          height -= mousemoveEvent.movementY * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);
          break;

        case WidgetHandle.BottomRight:
          width += mousemoveEvent.movementX * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
          height += mousemoveEvent.movementY * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);
          break;



        case WidgetHandle.BottomLeft:
          width -= mousemoveEvent.movementX * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
          height += mousemoveEvent.movementY * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);
          break;
      }




      const scale = (width + height) / (startWidth + startHeight);

      widget.width = startWidth * scale;
      widget.height = widget.width * aspectRatio;

      
      // Vertical alignment is set to middle
      if (verticalAlignmentType == VerticalAlignmentType.Middle) {

        // Adjust the row's position
        if (widget.height > rowHeight) {
          
          row.top -= (widget.height - previousHeight - Math.max(0, rowHeight - previousHeight)) * 0.5
          row.rowElement.style.top = row.top + 'px';
        } else {
          if (previousHeight > rowHeight) {
            row.top += (previousHeight - rowHeight) * 0.5;
            row.rowElement.style.top = row.top + 'px';
          }
        }
      }



      widget.widgetElement.style.maxWidth = widget.width + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }


  // ----------------------------------------------------------------------On Bottom Widget Handle Mousedown--------------------------------------------------
  private onBottomWidgetHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetDocument;
    const row = this.selectedRow;
    const breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint as string));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rowHeight = this.getRowHeight();
    const minHeight = this.getMinHeight();
    const widget = this.selectedWidget;


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = widget.height;
      let delta = mousemoveEvent.movementY;

      // Set the new height
      widget.height += delta * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);

      // Make sure the new height does NOT go below the min height
      if (widget.height < minHeight) {
        widget.height = minHeight;
        delta = (widget.height - previousHeight) * (verticalAlignmentType == VerticalAlignmentType.Middle ? 0.5 : 1);
      }

      // Vertical alignment is set to middle
      if (verticalAlignmentType == VerticalAlignmentType.Middle) {

        // Adjust the row's position
        if (widget.height > rowHeight) {
          row.top -= delta - Math.max(0, rowHeight - previousHeight) * 0.5;
          row.rowElement.style.top = row.top + 'px';
        } else {
          if (previousHeight > rowHeight) {
            row.top += (previousHeight - rowHeight) * 0.5;
            row.rowElement.style.top = row.top + 'px';
          }
        }
      } else

        // Vertical alignment is set to bottom
        if (verticalAlignmentType == VerticalAlignmentType.Bottom) {
          // Adjust the row's position
          if (widget.height < rowHeight) {
            if (previousHeight > rowHeight) {
              row.top += widget.height - rowHeight;
            } else {
              row.top += delta;
            }

            row.rowElement.style.top = row.top + 'px';
          } else {
            if (previousHeight < rowHeight) {
              row.top -= previousHeight - rowHeight;
              row.rowElement.style.top = row.top + 'px';
            }
          }
        }

      widget.widgetElement.style.minHeight = widget.height + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      this.widgetHandleMove = false;
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }






  // ----------------------------------------------------------------------On Top Widget Handle Mousedown--------------------------------------------------
  private onTopWidgetHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetDocument;
    const row = this.selectedRow;
    const breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint as string));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rowHeight = this.getRowHeight();
    const minHeight = this.getMinHeight();
    const widget = this.selectedWidget;

    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = widget.height;
      let delta = mousemoveEvent.movementY;

      // Set the new height
      widget.height -= delta * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);


      // Make sure the new height does NOT go below the min height
      if (widget.height < minHeight) {
        widget.height = minHeight;
        delta = (previousHeight - widget.height) * (verticalAlignmentType == VerticalAlignmentType.Middle ? 0.5 : 1);
      }


      // Vertical alignment is set to top
      if (verticalAlignmentType == VerticalAlignmentType.Top) {
        row.top += delta;
        row.rowElement.style.top = row.top + 'px';
      } else
        // Vertical alignment is set to middle
        if (verticalAlignmentType == VerticalAlignmentType.Middle) {

          // Adjust the row's position
          if (widget.height > rowHeight) {
            row.top += delta + Math.max(0, rowHeight - previousHeight) * 0.5;
            row.rowElement.style.top = row.top + 'px';
          } else {
            if (previousHeight > rowHeight) {
              row.top += (previousHeight - rowHeight) * 0.5;
              row.rowElement.style.top = row.top + 'px';
            }
          }
        } else
          // Vertical alignment is set to bottom
          if (verticalAlignmentType == VerticalAlignmentType.Bottom) {
            // Adjust the row's position
            if (widget.height < rowHeight) {
              if (previousHeight > rowHeight) {
                row.top += previousHeight - rowHeight;
              }

              row.rowElement.style.top = row.top + 'px';
            } else {

              if (previousHeight < rowHeight) {
                row.top -= widget.height - rowHeight;
                row.rowElement.style.top = row.top + 'px';
              } else {
                row.top += delta;
                row.rowElement.style.top = row.top + 'px';
              }
            }
          }


      widget.widgetElement.style.minHeight = widget.height + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      this.widgetHandleMove = false;
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }






  // ----------------------------------------------------------------------On Right Widget Handle Mousedown--------------------------------------------------
  private onRightWidgetHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetDocument;
    const column = this.selectedColumn;
    const widget = this.selectedWidget;
    const breakpoint = this.breakpointService.getBreakpoint(widget.horizontalAlignment.values.map(x => x.breakpoint as string));
    const horizontalAlignmentValue = widget.horizontalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const horizontalAlignmentType = horizontalAlignmentValue ? horizontalAlignmentValue.horizontalAlignmentType : HorizontalAlignmentType.Left;

    if (!widget.width) widget.width = column.columnElement.clientWidth;


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const delta = mousemoveEvent.movementX;

      widget.width += delta * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
      if (widget.width > column.columnElement.clientWidth) widget.width = column.columnElement.clientWidth;


      widget.widgetElement.style.maxWidth = widget.width + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      this.widgetHandleMove = false;
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }







  // ----------------------------------------------------------------------On Left Widget Handle Mousedown--------------------------------------------------
  private onLeftWidgetHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetDocument;
    const column = this.selectedColumn;
    const widget = this.selectedWidget;
    const breakpoint = this.breakpointService.getBreakpoint(widget.horizontalAlignment.values.map(x => x.breakpoint as string));
    const horizontalAlignmentValue = widget.horizontalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const horizontalAlignmentType = horizontalAlignmentValue ? horizontalAlignmentValue.horizontalAlignmentType : HorizontalAlignmentType.Left;

    if (!widget.width) widget.width = column.columnElement.clientWidth;


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const delta = mousemoveEvent.movementX;

      widget.width -= delta * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
      if (widget.width > column.columnElement.clientWidth) widget.width = column.columnElement.clientWidth;


      widget.widgetElement.style.maxWidth = widget.width + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      this.widgetHandleMove = false;
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }








  // ----------------------------------------------------------------------Get Row Height------------------------------------------------
  private getRowHeight(): number {
    let rowHeight = 0;

    const columnHeights = this.selectedRow.columns
      .filter(x => x != this.selectedColumn)
      .map(x => x.columnElement.getBoundingClientRect().height);

    if (columnHeights.length > 0) rowHeight = columnHeights.reduce((a, b) => Math.max(a, b));

    return rowHeight;
  }








  // ----------------------------------------------------------------------Get Min Height------------------------------------------------
  private getMinHeight(): number {
    const children: Array<Element> = Array.from(this.selectedWidget.widgetElement.children).filter(x => x.id != 'handles' && x.id != 'cover');
    return Math.max(...children.map((x: any) => x.offsetHeight));
  }
}