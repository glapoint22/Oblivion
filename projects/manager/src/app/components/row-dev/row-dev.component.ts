import { Component, ComponentFactoryResolver } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Column, ColumnSpan, ImageWidgetData, Row, RowComponent, VideoWidgetData, WidgetData, WidgetType } from 'widgets';
import { MenuOptionType, WidgetInspectorView } from '../../classes/enums';
import { MenuOption } from '../../classes/menu-option';
import { WidgetService } from '../../services/widget/widget.service';
import { ColumnDevComponent } from '../column-dev/column-dev.component';
import { ContainerDevComponent } from '../container-dev/container-dev.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'row-dev',
  templateUrl: './row-dev.component.html',
  styleUrls: ['./row-dev.component.scss']
})
export class RowDevComponent extends RowComponent {
  public columns: Array<ColumnDevComponent> = new Array<ColumnDevComponent>();
  public containerComponent!: ContainerDevComponent;
  public widgetInspectorView = WidgetInspectorView;

  constructor(resolver: ComponentFactoryResolver, public widgetService: WidgetService, private lazyLoadingService: LazyLoadingService) { super(resolver); }


  // ------------------------------------------------------------------------ Create Columns ---------------------------------------------------------
  public createColumns(columns: Array<Column>): void {
    columns.forEach((column: Column, index) => {
      this.createColumn(column, index);
    });
  }




  // ------------------------------------------------------------------------ Create Column ---------------------------------------------------------
  public createColumn(column: Column, index: number): void {
    const componentFactory = this.resolver.resolveComponentFactory(ColumnDevComponent);
    const columnComponentRef = this.viewContainerRef.createComponent(componentFactory, index);

    this.columns.splice(index, 0, columnComponentRef.instance);


    const columnComponent = columnComponentRef.instance;

    columnComponent.rowComponent = this;
    columnComponent.columnElement = columnComponentRef.location.nativeElement;

    // Set the column with the column data
    columnComponent.setColumn(column);


    // Detect changes
    columnComponentRef.hostView.detectChanges();

    // Create the widget
    columnComponent.createWidget(column.widgetData);
  }





  // ------------------------------------------------------------------------ Delete Column ---------------------------------------------------------
  public deleteColumn(column: ColumnDevComponent): void {
    const index = this.columns.findIndex(x => x == column);

    this.columns.splice(index, 1);
    this.viewContainerRef.remove(index);
    this.columnCount--;


    const columnSpan = this.getColumnSpan(this.columnCount);
    this.setColumnSpans(columnSpan);

    this.widgetService.deselectWidget();
  }


  // ------------------------------------------------------------------------ Reset Columns -------------------------------------------------------------
  resetColumns(): number {
    this.columnCount++;
    const columnSpan = this.getColumnSpan(this.columnCount);
    this.setColumnSpans(columnSpan);
    return columnSpan;
  }


  // ------------------------------------------------------------------------ addColumn -------------------------------------------------------------
  public addColumn(addend: number, columnElement: HTMLElement, data: WidgetData | Column): void {
    // Data is for widget
    if (data instanceof WidgetData) {

      // If widget data is image or video and it's not copied data, open the media browser
      if ((data.widgetType == WidgetType.Image && !(data as ImageWidgetData).image) ||
        (data.widgetType == WidgetType.Video && !(data as VideoWidgetData).video)) {
        this.widgetService.loadMediaBrowser(data, () => {
          const columnSpan = this.resetColumns();

          this.createColumn(new Column(columnSpan, data), this.getColumnIndex(columnElement, addend));
          this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Widget;
          this.widgetService.page.save();
        });
      } else {
        const columnSpan = this.resetColumns();

        this.createColumn(new Column(columnSpan, data), this.getColumnIndex(columnElement, addend));
        this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Widget;
        this.widgetService.page.save();
      }

      // Data is for column
    } else {
      const columnSpan = this.resetColumns();

      data.columnSpan.values[0].span = columnSpan;
      this.createColumn(data, this.getColumnIndex(columnElement, addend));
      this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Column;
      this.widgetService.page.save();
    }
  }



  // --------------------------------------------------------------------- Get Column Index -----------------------------------------------------------
  private getColumnIndex(columnElement: HTMLElement, index: number): number {
    return this.columns.findIndex(x => x.columnElement == columnElement) + index;
  }



  // ---------------------------------------------------------------------- Set Column Spans ----------------------------------------------------------
  private setColumnSpans(columnSpan: number): void {
    this.columns.forEach((column: ColumnDevComponent) => {
      column.columnSpan = new ColumnSpan(columnSpan);
      column.columnSpan.setClasses(column.columnElement);
    });
  }



  // ---------------------------------------------------------------------- Get Column Span ----------------------------------------------------------
  public getColumnSpan(columnCount: number): number {
    return Math.max(2, Math.floor(12 / columnCount));
  }



  // ------------------------------------------------------------------------ On Mouseup -------------------------------------------------------------
  public onMouseup(): void {
    if (this.widgetService.widgetCursor) {
      this.widgetService.clearWidgetCursor();
    }
  }



  // ------------------------------------------------------------------------ On Mousedown -------------------------------------------------------------
  public onMousedown(event: MouseEvent): void {
    event.stopPropagation();

    this.widgetService.selectedRow = this;
    this.widgetService.selectedColumn = null!;
    this.widgetService.selectedWidget = null!;
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Row;

    if (this.widgetService.contextMenu) {
      this.widgetService.contextMenu.close();
      this.widgetService.contextMenu = null!;
    }

    if (event.button == 0) {
      this.widgetService.onRowMousedown(event);

    } else if (event.button == 2) {
      this.lazyLoadingService.load(async () => {
        const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
        const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

        return {
          component: ContextMenuComponent,
          module: ContextMenuModule
        }
      }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
        this.widgetService.contextMenu = contextMenu;
        contextMenu.xPos = event.screenX;
        contextMenu.yPos = event.clientY + 66;
        contextMenu.options = this.getRowContextMenuOptions();
      });
    }
  }


  // ------------------------------------------------------------------- Get Row Context Menu Options ------------------------------------------------------
  public getRowContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: 'Cut row',
        shortcut: 'Ctrl+R',
        optionFunction: () => {
          this.widgetService.clipboard = this.getData();
          this.containerComponent.deleteRow(this);
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Copy row',
        shortcut: 'Ctrl+Y',
        optionFunction: () => this.widgetService.clipboard = this.getData()
      },
      {
        type: MenuOptionType.Divider
      },
      {
        type: MenuOptionType.Submenu,
        name: 'Duplicate row',
        options: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Above',
            optionFunction: () => {
              const container = this.containerComponent;
              container.duplicateRowAbove(this);
            }
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Below',
            optionFunction: () => {
              const container = this.containerComponent;
              container.duplicateRowBelow(this);
            }
          }
        ]
      },
      {
        type: MenuOptionType.Divider
      },
      {
        type: MenuOptionType.Submenu,
        name: 'Move row',
        isDisabled: !this.containerComponent.isRowAbove(this) && !this.containerComponent.isRowBelow(this),
        options: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Above',
            isDisabled: !this.containerComponent.isRowAbove(this),
            optionFunction: () => {
              const container = this.containerComponent;
              container.moveRowAbove(this);
            }
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Below',
            isDisabled: !this.containerComponent.isRowBelow(this),
            optionFunction: () => {
              const container = this.containerComponent;
              container.moveRowBelow(this);
            }
          }
        ]
      },
      {
        type: MenuOptionType.Divider
      },

      {
        type: MenuOptionType.MenuItem,
        name: 'Delete row',
        shortcut: 'Delete',
        optionFunction: () => {
          this.containerComponent.deleteRow(this);
        }
      }
    ]
  }






  // -------------------------------------------------------------------------- Get Data ------------------------------------------------------------
  public getData(): Row {
    const row = new Row(this.top);

    row.columns = [];
    row.background = this.background.getData();
    row.border = this.border.getData();
    row.corners = this.corners.getData();
    row.shadow = this.shadow.getData();
    row.padding = this.padding.getData();
    row.verticalAlignment = this.verticalAlignment.getData();
    this.columns.forEach((column: ColumnDevComponent) => row.columns.push(column.getData()));
    return row;
  }





  // -------------------------------------------------------------------------- Move Widget ------------------------------------------------------------
  public moveColumn(column: ColumnDevComponent, direction: number): void {
    const columnIndex = this.columns.findIndex(x => x == column);
    const veiwRef = this.viewContainerRef.get(columnIndex)!;

    this.moveColumnIndex(columnIndex, columnIndex + 1 * direction);
    this.viewContainerRef.move(veiwRef, columnIndex + 1 * direction);
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Column;
  }



  // ----------------------------------------------------------------------- Move Column Index ---------------------------------------------------------
  private moveColumnIndex(from: number, to: number): void {
    const cutOut = this.columns.splice(from, 1)[0];
    this.columns.splice(to, 0, cutOut);
  }
}