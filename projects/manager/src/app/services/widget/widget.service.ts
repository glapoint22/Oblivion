import { Injectable } from '@angular/core';
import { DataService, Image, LazyLoadingService, MediaType, SpinnerAction, Video } from 'common';
import { Subject } from 'rxjs';
import { Column, HorizontalAlignmentType, ImageWidgetData, Row, VerticalAlignmentType, VideoWidgetData, Widget, WidgetData, WidgetType } from 'widgets';
import { BuilderType, ImageLocation, ImageSize, WidgetCursorType, WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { ColumnDevComponent } from '../../components/column-dev/column-dev.component';
import { ContainerDevComponent } from '../../components/container-dev/container-dev.component';
import { ContainerWidgetDevComponent } from '../../components/container-widget-dev/container-widget-dev.component';
import { MediaBrowserComponent } from '../../components/media-browser/media-browser.component';
import { PageDevComponent } from '../../components/page-dev/page-dev.component';
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
  public currentWidgetInspectorView!: WidgetInspectorView;
  public clipboard!: Row | Column | WidgetData;
  public page!: PageDevComponent;
  public viewPortTop!: number;


  constructor(private breakpointService: BreakpointService, private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }


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




  // ------------------------------------------------------------------------Deselect Widget------------------------------------------------------------
  public deselectWidget(): void {
    this.selectedWidget = null!
    this.selectedColumn = null!
    this.selectedRow = null!;
    this.currentWidgetInspectorView = WidgetInspectorView.Page;
  }



  // ------------------------------------------------------------------------Load Media Browser------------------------------------------------------------
  public loadMediaBrowser(widgetData: WidgetData, callback: Function) {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../../components/media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../../components/media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        const mediaType = widgetData.widgetType == WidgetType.Image ? MediaType.Image : MediaType.Video;
        const imageSize = widgetData.widgetType == WidgetType.Image ? ImageSize.AnySize : null;

        mediaBrowser.currentMediaType = mediaType;
        mediaBrowser.imageSize = imageSize!;
        mediaBrowser.callback = (media: Image | Video) => {
          if (mediaType == MediaType.Image) {
            const imageWidgetData = widgetData as ImageWidgetData;
            imageWidgetData.image = media as Image;

            // Add the image reference
            this.dataService.post('api/Media/ImageReference', {
              imageId: media.id,
              imageSize: ImageSize.AnySize,
              builder: BuilderType.Page,
              host: this.page.name,
              location: ImageLocation.ImageWidget
            }).subscribe();

          } else {
            const videoWidgetData = widgetData as VideoWidgetData;
            videoWidgetData.video = media as Video;
          }
          callback();
        }
      });
  }



  // ----------------------------------------------------------------------On Widget Handle Mousedown---------------------------------------------------------
  public onWidgetHandleMousedown(widgetHandle: WidgetHandle, mousedownEvent: MouseEvent) {

    switch (widgetHandle) {
      // Top Left
      case WidgetHandle.TopLeft:
        if (this.selectedWidget.type == WidgetType.Image || this.selectedWidget.type == WidgetType.Video) {
          this.onMediaWidgetHandleMousedown(mousedownEvent, widgetHandle);
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
          this.onMediaWidgetHandleMousedown(mousedownEvent, widgetHandle);
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
          this.onMediaWidgetHandleMousedown(mousedownEvent, widgetHandle);
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
          this.onMediaWidgetHandleMousedown(mousedownEvent, widgetHandle);
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









  // ----------------------------------------------------------------------On Bottom Widget Handle Mousedown--------------------------------------------------
  private onBottomWidgetHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetDocument;
    const row = this.selectedRow;
    const breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint!));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rowHeight = this.getRowHeight();
    const minHeight = this.getMinHeight();
    const widget = this.selectedWidget;
    let handleMoved: boolean;

    widget.height = widget.widgetElement.clientHeight;

    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = widget.height;
      let delta = mousemoveEvent.movementY;

      handleMoved = true;

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
        } else {
          if (previousHeight > rowHeight) {
            row.top += (previousHeight - rowHeight) * 0.5;
          }
        }

        // Vertical alignment is set to bottom
      } else if (verticalAlignmentType == VerticalAlignmentType.Bottom) {
        // Adjust the row's position
        if (widget.height < rowHeight) {
          if (previousHeight > rowHeight) {
            row.top += widget.height - rowHeight;
          } else {
            row.top += delta;
          }

        } else {
          if (previousHeight < rowHeight) {
            row.top -= previousHeight - rowHeight;
          }
        }
      }


      // Get the new row top
      const newRowTop = this.getNewRowTopAfterContainerTopCollision(row.top);

      // If the new row top is different than the old row top
      if (row.top != newRowTop) {
        delta = newRowTop - row.top;
        row.top = newRowTop;
        // Set the new height
        widget.height -= delta * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);
      }


      row.rowElement.style.top = row.top + 'px';
      widget.widgetElement.style.minHeight = widget.height + 'px';
      this.manageRowCollision(row);
      this.onRowChange(row.containerComponent);
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      if (handleMoved) this.page.save();
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }






  // ----------------------------------------------------------------------On Top Widget Handle Mousedown--------------------------------------------------
  private onTopWidgetHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetDocument;
    const row = this.selectedRow;
    const breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint!));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rowHeight = this.getRowHeight();
    const minHeight = this.getMinHeight();
    const widget = this.selectedWidget;
    let handleMoved: boolean;

    widget.height = widget.widgetElement.clientHeight;

    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = widget.height;
      let delta = mousemoveEvent.movementY;

      handleMoved = true;

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


        // Vertical alignment is set to middle
      } else if (verticalAlignmentType == VerticalAlignmentType.Middle) {

        // Adjust the row's position
        if (widget.height > rowHeight) {
          row.top += delta + Math.max(0, rowHeight - previousHeight) * 0.5;
        } else {
          if (previousHeight > rowHeight) {
            row.top += (previousHeight - rowHeight) * 0.5;
          }
        }

        // Vertical alignment is set to bottom
      } else if (verticalAlignmentType == VerticalAlignmentType.Bottom) {
        // Adjust the row's position
        if (widget.height < rowHeight) {
          if (previousHeight > rowHeight) {
            row.top += previousHeight - rowHeight;
          }
        } else {

          if (previousHeight < rowHeight) {
            row.top -= widget.height - rowHeight;
          } else {
            row.top += delta;
          }
        }
      }

      // Get the new row top
      const newRowTop = this.getNewRowTopAfterContainerTopCollision(row.top);

      // If the new row top is different than the old row top
      if (row.top != newRowTop) {
        delta = newRowTop - row.top;
        row.top = newRowTop;
        // Set the new height
        widget.height -= delta * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);
      }

      row.rowElement.style.top = row.top + 'px';
      widget.widgetElement.style.minHeight = widget.height + 'px';
      this.manageRowCollision(row);
      this.onRowChange(row.containerComponent);
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      if (handleMoved) this.page.save();
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
    const breakpoint = this.breakpointService.getBreakpoint(column.horizontalAlignment.values.map(x => x.breakpoint!));
    const horizontalAlignmentValue = column.horizontalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const horizontalAlignmentType = horizontalAlignmentValue ? horizontalAlignmentValue.horizontalAlignmentType : HorizontalAlignmentType.Left;
    let handleMoved: boolean;

    if (!widget.width) widget.width = column.columnElement.clientWidth;


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const delta = mousemoveEvent.movementX;

      handleMoved = true;

      widget.width += delta * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
      if (widget.width > column.columnElement.clientWidth) widget.width = column.columnElement.clientWidth;


      widget.widgetElement.style.maxWidth = widget.width + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      if (widget.width >= column.columnElement.clientWidth) widget.width = null!;
      if (handleMoved) this.page.save();
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
    const breakpoint = this.breakpointService.getBreakpoint(column.horizontalAlignment.values.map(x => x.breakpoint!));
    const horizontalAlignmentValue = column.horizontalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const horizontalAlignmentType = horizontalAlignmentValue ? horizontalAlignmentValue.horizontalAlignmentType : HorizontalAlignmentType.Left;
    let handleMoved: boolean;

    if (!widget.width) widget.width = column.columnElement.clientWidth;


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const delta = mousemoveEvent.movementX;

      handleMoved = true;

      widget.width -= delta * (horizontalAlignmentType == HorizontalAlignmentType.Center ? 2 : 1);
      if (widget.width > column.columnElement.clientWidth) widget.width = column.columnElement.clientWidth;


      widget.widgetElement.style.maxWidth = widget.width + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      if (widget.width >= column.columnElement.clientWidth) widget.width = null!;
      if (handleMoved) this.page.save();
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }







  // ------------------------------------------------------------------On Media Widget Handle Mousedown---------------------------------------------------------
  onMediaWidgetHandleMousedown(mousedownEvent: MouseEvent, widgetHandle: WidgetHandle) {
    const document = this.widgetDocument;
    const widget = this.selectedWidget;
    const column = this.selectedColumn;
    let breakpoint = this.breakpointService.getBreakpoint(column.horizontalAlignment.values.map(x => x.breakpoint!));
    const horizontalAlignmentValue = column.horizontalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const horizontalAlignmentType = horizontalAlignmentValue ? horizontalAlignmentValue.horizontalAlignmentType : HorizontalAlignmentType.Left;
    const row = this.selectedRow;
    breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint!));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rect = widget.widgetElement.getBoundingClientRect();
    const startWidth = rect.width;
    const startHeight = rect.height;
    let width = startWidth;
    let height = startHeight;
    let handleMoved: boolean;
    const rowHeight = this.getRowHeight();
    const aspectRatio = widget.widgetElement.getBoundingClientRect().height / widget.widgetElement.getBoundingClientRect().width;
    widget.height = widget.widgetElement.clientHeight;

    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = widget.height;

      handleMoved = true;

      // This is used to scale in the correct direction
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

      // Get the new scale
      const scale = (width + height) / (startWidth + startHeight);

      // Set the new width and height
      widget.width = startWidth * scale;
      widget.height = widget.width * aspectRatio;


      // Vertical alignment is set to middle
      if (verticalAlignmentType == VerticalAlignmentType.Middle || verticalAlignmentType == VerticalAlignmentType.Bottom) {

        // Adjust the row's position
        if (widget.height > rowHeight) {
          row.top -= (widget.height - previousHeight - Math.max(0, rowHeight - previousHeight)) * (verticalAlignmentType == VerticalAlignmentType.Middle ? 0.5 : 1);
        } else {
          if (previousHeight > rowHeight) {
            row.top += (previousHeight - rowHeight) * (verticalAlignmentType == VerticalAlignmentType.Middle ? 0.5 : 1);
          }
        }
      }


      // Get the new row top
      const newRowTop = this.getNewRowTopAfterContainerTopCollision(row.top);

      // If the new row top is different than the old row top
      if (row.top != newRowTop) {
        const diff = newRowTop - row.top;

        widget.width -= diff * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1) / aspectRatio;
        widget.height -= diff * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);
        row.top = newRowTop;
      }


      row.rowElement.style.top = row.top + 'px';
      widget.widgetElement.style.maxWidth = widget.width + 'px';
      this.manageRowCollision(row);
      this.onRowChange(row.containerComponent);
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      if (handleMoved) this.page.save();
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }






  // ----------------------------------------------------------------------On Row Mousedown------------------------------------------------
  public onRowMousedown(mousedownEvent: MouseEvent): void {
    if (mousedownEvent.button != 0) return;

    const row = this.selectedRow;
    const rowElement = row.rowElement;
    const document = this.widgetDocument;
    let rowMoved: boolean;

    const onRowMousemove = (mousemoveEvent: MouseEvent) => {
      rowMoved = true;
      row.top = this.getNewRowTopAfterContainerTopCollision(row.top + mousemoveEvent.movementY);
      rowElement.style.top = row.top + 'px';

      this.manageRowCollision(row);
      this.onRowChange(row.containerComponent);
    }

    const onRowMouseup = () => {
      document.removeEventListener('mousemove', onRowMousemove);
      document.removeEventListener('mouseup', onRowMouseup);
      if (rowMoved) this.page.save();
    }

    document.addEventListener('mousemove', onRowMousemove);
    document.addEventListener('mouseup', onRowMouseup);
  }






  // ----------------------------------------------------------------------On Row Change------------------------------------------------
  public onRowChange(container: ContainerDevComponent): void {
    const maxBottom = container.rows.map(x => x.rowElement.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b));
    container.host.onRowChange(maxBottom - container.viewContainerRef.element.nativeElement.parentElement.getBoundingClientRect().top);
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
    if (this.selectedWidget.type == WidgetType.Container) {
      const containerWidget = this.selectedWidget as ContainerWidgetDevComponent;
      const container = containerWidget.container as ContainerDevComponent;
      const maxBottom = container.rows && container.rows.length > 0 ?
        container.rows.map(x => x.rowElement.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b)) : 0;
      const containerTop = container.viewContainerRef.element.nativeElement.parentElement.getBoundingClientRect().top;

      return maxBottom - containerTop;
    }

    const children: Array<Element> = Array.from(this.selectedWidget.widgetElement.children).filter(x => x.id != 'ignore-element-height');
    return Math.max(...children.map((x: any) => x.offsetHeight));
  }





  // --------------------------------------------------------------------Manage Row Collision---------------------------------------------
  public manageRowCollision(row: RowDevComponent): void {
    const rowTop = row.top;
    const rowBottom = rowTop + row.rowElement.getBoundingClientRect().height;

    row.containerComponent.rows
      .filter(x => x != row)
      .forEach((otherRow: RowDevComponent) => {
        const otherRowElement = otherRow.rowElement;
        const otherRowElementClientRect = otherRowElement.getBoundingClientRect();
        const otherRowElementTop = parseInt(otherRowElement.style.top);
        const otherRowElementBottom = otherRowElementTop + otherRowElementClientRect.height;

        if (rowTop < otherRowElementBottom && rowBottom > otherRowElementBottom) {
          const otherRowElementNewTop = rowTop - otherRowElementClientRect.height;

          otherRow.top = otherRowElementNewTop;
          otherRowElement.style.top = otherRowElementNewTop + 'px';


          this.manageRowCollision(otherRow);
        } else if (rowBottom > otherRowElementTop && rowTop < otherRowElementTop) {

          const otherRowElementNewTop = rowBottom;

          otherRow.top = otherRowElementNewTop;
          otherRowElement.style.top = otherRowElementNewTop + 'px';

          this.manageRowCollision(otherRow);
        }
      });
  }




  // ---------------------------------------------------------Get New Row Top After Container Top Collision---------------------------------------------
  private getNewRowTopAfterContainerTopCollision(newTop: number): number {
    const row = this.selectedRow;
    const rowElement = row.rowElement;
    const otherRowElements = row.containerComponent.rows
      .map(x => x.rowElement)
      .filter(x => x != rowElement && x.getBoundingClientRect().bottom <= rowElement.getBoundingClientRect().top);


    newTop = Math.max(0, newTop);


    if (otherRowElements.length > 0) {
      const totalRowHeight = otherRowElements
        .map(x => x.getBoundingClientRect().height)
        .reduce((a, b) => a + b);

      if (newTop <= totalRowHeight) newTop = totalRowHeight;
    }

    return newTop;
  }
}