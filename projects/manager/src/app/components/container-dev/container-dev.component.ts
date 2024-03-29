import { Component, ComponentRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Column, ColumnSpan, ContainerComponent, ImageWidgetData, Row, RowComponent, VideoWidgetData, WidgetData, WidgetType } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { BuilderType, MenuOptionType, WidgetCursorType, WidgetInspectorView } from '../../classes/enums';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { WidgetService } from '../../services/widget/widget.service';
import { PageDevComponent } from '../page-dev/page-dev.component';
import { RowDevComponent } from '../row-dev/row-dev.component';

@Component({
  selector: 'container-dev',
  templateUrl: './container-dev.component.html',
  styleUrls: ['./container-dev.component.scss']
})
export class ContainerDevComponent extends ContainerComponent {
  public rows: Array<RowDevComponent> = new Array<RowDevComponent>();
  public showRowIndicator!: boolean;
  public host!: ContainerHost;
  public page!: PageDevComponent;

  constructor
    (
      public widgetService: WidgetService,
      private lazyLoadingService: LazyLoadingService
    ) { super() }


  ngAfterViewInit() {
    window.setTimeout(() => {
      if (this.host instanceof PageDevComponent) {
        this.page = this.host as PageDevComponent;
      }
    });

  }

  // ----------------------------------------------------------------------- Ng On Init ---------------------------------------------------------
  public ngOnInit(): void {


    this.widgetService.$onContainerMousemove.subscribe((containerDevComponent: ContainerDevComponent) => {
      if (containerDevComponent == this) {
        this.showRowIndicator = true;
      } else {
        this.showRowIndicator = false;
      }
    });
  }


  // ---------------------------------------------------------------------- Create Row For Widget --------------------------------------------------
  createRowForWidget(row: Row) {
    this.createRow(row);
    this.widgetService.page.save();
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Widget;
  }





  // --------------------------------------------------------------------------- Add Widget ---------------------------------------------------------
  public addWidget(widgetData: WidgetData, top: number): void {
    const row = new Row(top);

    row.columns.push(new Column(12, widgetData));

    if ((widgetData.widgetType == WidgetType.Image && !(widgetData as ImageWidgetData).image) ||
      (widgetData.widgetType == WidgetType.Video && !(widgetData as VideoWidgetData).video)) {
      this.widgetService.loadMediaBrowser(widgetData, () => this.createRowForWidget(row));
    } else {
      this.createRowForWidget(row);
    }
  }


  // --------------------------------------------------------------------- On Container Mouseup ----------------------------------------------------
  public onContainerMouseup(event: MouseEvent): void {
    if (this.widgetService.widgetCursor) {
      const top = this.getRowTop(event.clientY);
      const row = new Row(top);
      const widgetType = this.widgetService.widgetCursor.widgetType;
      const widgetData = new WidgetData(widgetType);

      row.columns.push(new Column(12, widgetData));

      if (widgetType == WidgetType.Image || widgetType == WidgetType.Video) {
        this.widgetService.loadMediaBrowser(widgetData, () => this.createRowForWidget(row));
      } else {
        this.createRowForWidget(row);
      }

      this.widgetService.clearWidgetCursor();
    }
  }



  // --------------------------------------------------------------------- On Container Mousemove ----------------------------------------------------
  public onContainerMousemove(event: MouseEvent, rowIndicator: HTMLElement): void {
    if (this.widgetService.widgetCursor) {
      event.stopPropagation();

      const top = this.viewContainerRef.element.nativeElement.parentElement.getBoundingClientRect().top;

      this.widgetService.$onContainerMousemove.next(this);
      rowIndicator.style.top = event.clientY - top + 'px';
    }
  }



  // --------------------------------------------------------------------- On Container Mouseenter ----------------------------------------------------
  public onContainerMouseenter(): void {
    this.showRowIndicator = false;
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.Allowed);
    }
  }






  // --------------------------------------------------------------------- On Container Mouseleave ----------------------------------------------------
  public onContainerMouseleave(): void {
    this.showRowIndicator = false;
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.NotAllowed);
    }
  }







  // --------------------------------------------------------------------- Create Row ComponentRef ----------------------------------------------------
  public createRowComponentRef(top: number): ComponentRef<RowDevComponent> {
    const index = this.getRowIndex(top);
    const rowComponentRef: ComponentRef<RowDevComponent> = this.viewContainerRef.createComponent(RowDevComponent, { index: index })
    const rowComponent: RowDevComponent = rowComponentRef.instance;

    this.rows.splice(index, 0, rowComponent);
    rowComponent.containerComponent = this;
    return rowComponentRef;
  }




  getWidgetSubmenus(yPos: number) {
    const emailWidgets = [
      {
        name: 'Text',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Text), this.getRowTop(yPos));
        }
      },
      {
        name: 'Container',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Container), this.getRowTop(yPos));
        }
      },
      {
        name: 'Image',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Image), this.getRowTop(yPos));
        }
      },
      {
        name: 'Button',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Button), this.getRowTop(yPos));
        }
      },
      {
        name: 'Line',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Line), this.getRowTop(yPos));
        }
      }
    ]

    const pageWidgets = [
      {
        name: 'Video',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Video), this.getRowTop(yPos));
        }
      },
      {
        name: 'Product Slider',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.ProductSlider), this.getRowTop(yPos));
        }
      },
      {
        name: 'Carousel',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Carousel), this.getRowTop(yPos));
        }
      },
      {
        name: 'Grid',
        type: MenuOptionType.MenuItem,
        optionFunction: () => {
          this.addWidget(new WidgetData(WidgetType.Grid), this.getRowTop(yPos));
        }
      }
    ]

    if (this.widgetService.page.builderType == BuilderType.Email) {
      return emailWidgets;
    } else {
      return emailWidgets.concat(pageWidgets);
    }
  }




  // --------------------------------------------------------------------------- On Mousedown ---------------------------------------------------------
  public onMousedown(event: MouseEvent): void {
    if (this.page) {

      window.dispatchEvent(new Event('mousedown'));

      this.widgetService.deselectWidget();

      if (event.button == 2) {
        if (this.page.pageContent) {
          this.lazyLoadingService.load(async () => {
            const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
            const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

            return {
              component: ContextMenuComponent,
              module: ContextMenuModule
            }
          }, SpinnerAction.None)
            .then((contextMenu: ContextMenuComponent) => {
              contextMenu.xPos = event.screenX;
              contextMenu.yPos = event.clientY + this.widgetService.viewPortTop;
              contextMenu.options = [
                {
                  type: MenuOptionType.MenuItem,
                  name: 'Paste',
                  shortcut: 'Ctrl+V',
                  optionFunction: () => {
                    this.paste(event.clientY)
                  },
                  isDisabled: !this.widgetService.clipboard
                },
                {
                  type: MenuOptionType.Divider
                },
                {
                  type: MenuOptionType.Submenu,
                  name: 'Add widget',
                  options: this.getWidgetSubmenus(event.clientY)
                },

                {
                  type: MenuOptionType.Divider
                },
                {
                  type: MenuOptionType.MenuItem,
                  name: 'New page',
                  shortcut: 'Ctrl+N',
                  optionFunction: () => this.widgetService.page.new()
                },
                {
                  type: MenuOptionType.MenuItem,
                  name: 'Duplicate page',
                  optionFunction: () => this.widgetService.page.duplicate()
                },
                {
                  type: MenuOptionType.Divider
                },

                {
                  type: MenuOptionType.MenuItem,
                  name: 'Delete page',
                  optionFunction: () => this.widgetService.page.delete()
                },
                {
                  type: MenuOptionType.Divider
                },

                {
                  type: MenuOptionType.MenuItem,
                  name: 'Close page',
                  optionFunction: () => this.widgetService.page.clear()
                }
              ];
            });
        } else {




          this.lazyLoadingService.load(async () => {
            const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
            const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

            return {
              component: ContextMenuComponent,
              module: ContextMenuModule
            }
          }, SpinnerAction.None)
            .then((contextMenu: ContextMenuComponent) => {
              contextMenu.parentObj = this;
              contextMenu.xPos = event.screenX;
              contextMenu.yPos = event.clientY + this.widgetService.viewPortTop;
              contextMenu.options = [

                {
                  type: MenuOptionType.MenuItem,
                  name: 'New page',
                  shortcut: 'Ctrl+N',
                  optionFunction: () => this.widgetService.page.new()
                }
              ];
            });
        }
      }
    }
  }



  // ------------------------------------------------------------------------ Delete Row ---------------------------------------------------------
  public deleteRow(row: RowDevComponent): void {
    const index = this.rows.findIndex(x => x == row);

    this.rows.splice(index, 1);
    this.viewContainerRef.remove(index);
    this.widgetService.deselectWidget();
    this.widgetService.page.save();
  }



  // ----------------------------------------------------------------------- Move Row Above -------------------------------------------------------
  public moveRowAbove(row: RowDevComponent): void {
    const rowIndex = this.rows.findIndex(x => x == row);
    const previousRow = this.rows[rowIndex - 1];
    const veiwRef = this.viewContainerRef.get(rowIndex)!;

    // Update the row's top
    row.top = Math.max(0, previousRow.top - row.rowElement.getBoundingClientRect().height);
    row.rowElement.style.top = row.top + 'px';

    // Move the row index
    this.moveRowIndex(rowIndex, rowIndex - 1);

    // Move the row in the view container
    this.viewContainerRef.move(veiwRef, rowIndex - 1);

    // Shift the rows
    if (row.top == 0) {
      this.shiftRowsDown(row);
    } else {
      this.shiftRowsUp(row);
    }

    this.widgetService.page.save();
  }





  // ----------------------------------------------------------------------- Move Row Below -------------------------------------------------------
  public moveRowBelow(row: RowDevComponent): void {
    const rowIndex = this.rows.findIndex(x => x == row);
    const nextRow = this.rows[rowIndex + 1];
    const nextRowBottom = nextRow.top + nextRow.rowElement.getBoundingClientRect().height;
    const veiwRef = this.viewContainerRef.get(rowIndex)!;

    // Update the row's top
    row.top = nextRowBottom;
    row.rowElement.style.top = row.top + 'px';

    // Move the row index
    this.moveRowIndex(rowIndex, rowIndex + 1);

    // Move the row in the view container
    this.viewContainerRef.move(veiwRef, rowIndex + 1);

    // Shift the rows
    this.shiftRowsDown(row);
    this.widgetService.page.save();
  }




  // -------------------------------------------------------------------------- Is Row Above ----------------------------------------------------------
  public isRowAbove(row: RowDevComponent): boolean {
    const rowIndex = this.rows.findIndex(x => x == row);

    return rowIndex > 0;
  }





  // -------------------------------------------------------------------------- Is Row Below ----------------------------------------------------------
  public isRowBelow(row: RowDevComponent): boolean {
    const rowIndex = this.rows.findIndex(x => x == row);

    return rowIndex != this.rows.length - 1;
  }




  // --------------------------------------------------------------------- Duplicate Row Above -------------------------------------------------------
  public duplicateRowAbove(row: RowDevComponent): void {
    const rowData = row.getData();

    rowData.top = row.top;
    this.createRow(rowData);
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Row;

    window.setTimeout(() => {
      this.shiftRowsUp(row);
      this.widgetService.onRowChange(this);
      this.widgetService.page.save();
    });
  }




  // --------------------------------------------------------------------- Duplicate Row Below -------------------------------------------------------
  public duplicateRowBelow(row: RowDevComponent): void {
    const rowData = row.getData();
    const height = row.rowElement.getBoundingClientRect().height;
    const top = row.top + height;

    rowData.top = top;
    this.createRow(rowData);
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Row;

    window.setTimeout(() => {
      const newRowIndex = this.rows.findIndex(x => x == row) + 1;
      const newRow = this.rows[newRowIndex];

      this.shiftRowsDown(newRow);
      this.widgetService.page.save();
    });
  }



  // ------------------------------------------------------------------------------ Paste -------------------------------------------------------------
  public paste(y: number): void {
    const top = this.getRowTop(y);

    // Widget
    if (this.widgetService.clipboard instanceof WidgetData) {
      this.addWidget(this.widgetService.clipboard, top);
    }

    // Row
    else if (this.widgetService.clipboard instanceof Row) {
      this.addRow(this.widgetService.clipboard, top);
    }

    // Column
    else if (this.widgetService.clipboard instanceof Column) {
      const column = this.widgetService.clipboard;

      column.columnSpan = new ColumnSpan(12);
      this.addColumn(column, top);
    }
  }




  // ----------------------------------------------------------------------- Move Row Index ---------------------------------------------------------
  private moveRowIndex(from: number, to: number): void {
    const cutOut = this.rows.splice(from, 1)[0];
    this.rows.splice(to, 0, cutOut);
  }






  // ------------------------------------------------------------------------ Shift Rows Up ----------------------------------------------------------
  private shiftRowsUp(startRow: RowComponent): void {
    let i = this.rows.findIndex(x => x == startRow);

    for (i; i > 0; i--) {
      const row = this.rows[i];
      const previousRow = this.rows[i - 1];
      const previousRowHeight = previousRow.rowElement.getBoundingClientRect().height;
      const previousRowBottom = previousRow.top + previousRowHeight;

      if (row.top < previousRowBottom) {
        previousRow.top = Math.max(0, row.top - previousRowHeight);
        previousRow.rowElement.style.top = previousRow.top + 'px';
      } else {
        break;
      }
    }

    if (this.rows[i].top == 0) {
      this.shiftRowsDown(this.rows[i]);
    }
  }






  // ---------------------------------------------------------------------------- Shift Rows Down --------------------------------------------------------
  private shiftRowsDown(startRow: RowComponent): void {
    const startIndex = this.rows.findIndex(x => x == startRow);

    for (let i = startIndex; i < this.rows.length - 1; i++) {
      const row = this.rows[i];
      const rowBottom = row.top + row.rowElement.getBoundingClientRect().height;
      const nextRow = this.rows[i + 1];

      if (rowBottom > nextRow.top) {
        nextRow.top = rowBottom;
        nextRow.rowElement.style.top = nextRow.top + 'px';
      } else {
        break;
      }
    }

    this.widgetService.onRowChange(this);
  }






  // ------------------------------------------------------------------------ Get Row Top ---------------------------------------------------------
  public getRowTop(y: number): number {
    const top = this.viewContainerRef.element.nativeElement.parentElement.getBoundingClientRect().top;
    return y - top;
  }









  // --------------------------------------------------------------------------- Add Row ---------------------------------------------------------
  private addRow(row: Row, top: number): void {
    row.top = top;
    this.createRow(row);
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Row;
    this.widgetService.page.save();
  }



  // --------------------------------------------------------------------------- Add Column ---------------------------------------------------------
  private addColumn(column: Column, top: number): void {
    const row = new Row(top);

    row.columns.push(column);
    this.createRow(row);
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Column;
    this.widgetService.page.save();
  }



  // ---------------------------------------------------------------------------- Get Row Index --------------------------------------------------------
  private getRowIndex(top: number): number {
    let index: number = -1;

    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];

      if (row.top < top) {
        index = i;
      } else {
        break;
      }
    }

    return index + 1;
  }



  // ---------------------------------------------------------------------------- Get Data --------------------------------------------------------
  public getData(): Array<Row> {
    const rows: Array<Row> = [];

    this.rows.forEach((row: RowDevComponent) => {
      rows.push(row.getData());
    });

    return rows;
  }
}