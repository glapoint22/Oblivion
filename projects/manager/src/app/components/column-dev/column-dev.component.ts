import { Component, ComponentFactoryResolver, ComponentRef, Type } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Column, ColumnComponent, Row, Widget, WidgetData, WidgetType } from 'widgets';
import { MenuOptionType, WidgetCursorType, WidgetInspectorView } from '../../classes/enums';
import { MenuOption } from '../../classes/menu-option';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { WidgetService } from '../../services/widget/widget.service';
import { ContainerDevComponent } from '../container-dev/container-dev.component';
import { ContainerWidgetDevComponent } from '../container-widget-dev/container-widget-dev.component';
import { RowDevComponent } from '../row-dev/row-dev.component';

@Component({
  selector: '[column-dev]',
  templateUrl: './column-dev.component.html',
  styleUrls: ['./column-dev.component.scss']
})
export class ColumnDevComponent extends ColumnComponent {
  public rowComponent!: RowDevComponent;
  private widget!: Widget;

  constructor(resolver: ComponentFactoryResolver, private widgetService: WidgetService, private lazyLoadingService: LazyLoadingService) { super(resolver) }


  // ---------------------------------------------------------------------Create Widget Component Ref----------------------------------------------------------------
  public async createWidgetComponentRef(widgetData: WidgetData): Promise<ComponentRef<Widget>> {
    const widgetComponentRef = await super.createWidgetComponentRef(widgetData);
    const widgetComponent = widgetComponentRef.instance;

    // Assign the widget
    this.widget = widgetComponent;

    // If this widget is a container widget
    if (widgetData.widgetType == WidgetType.Container) {
      const containerWidget = widgetComponent as ContainerWidgetDevComponent;

      containerWidget.hostContainer = this.rowComponent.containerComponent;
    }

    // Set this widget as selected
    this.setSelectedWidget(widgetComponent);


    // Mousedown
    widgetComponentRef.location.nativeElement.firstElementChild.addEventListener('mousedown', (event: MouseEvent) => {
      this.setSelectedWidget(widgetComponent);

      if (event.button == 2) {
        event.stopPropagation();

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
            contextMenu.yPos = event.clientY + 74;

            let menuOptions: Array<MenuOption> = [];
            let pasteOptions: Array<MenuOption> = [];
            let widgetOptions: Array<MenuOption> = [];

            // If the widget is a container widget
            if (widgetData.widgetType == WidgetType.Container) {

              // Show paste in container option
              pasteOptions = pasteOptions.concat([
                {
                  type: MenuOptionType.MenuItem,
                  name: 'Paste in container',
                  shortcut: 'Ctrl+V',
                  isDisabled: !this.widgetService.clipboard,
                  optionFunction: () => {
                    const containerWidget = this.widgetService.selectedWidget as ContainerWidgetDevComponent;
                    const container = containerWidget.container as ContainerDevComponent;

                    container.paste(event.clientY);
                  }
                }
              ]);


              // Show Add widget in container option
              widgetOptions = widgetOptions.concat([
                {
                  type: MenuOptionType.MenuItem,
                  name: 'Add widget in container',
                  optionFunction: () => {
                    const containerWidget = this.widgetService.selectedWidget as ContainerWidgetDevComponent;
                    const container = containerWidget.container as ContainerDevComponent;

                    container.addWidget(new WidgetData(WidgetType.Button), container.getRowTop(event.clientY));
                  }
                }
              ]);
            }

            // Concat the paste options
            menuOptions = menuOptions.concat(pasteOptions);


            // Show the default paste options
            menuOptions = menuOptions.concat([
              {
                type: MenuOptionType.MenuItem,
                name: 'Paste left',
                isDisabled: !this.widgetService.clipboard || this.widgetService.clipboard instanceof Row,
                optionFunction: () => {
                  if (!(this.widgetService.clipboard instanceof Row))
                    this.rowComponent.addColumn(0, this.columnElement, this.widgetService.clipboard);
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Paste right',
                isDisabled: !this.widgetService.clipboard || this.widgetService.clipboard instanceof Row,
                optionFunction: () => {
                  if (!(this.widgetService.clipboard instanceof Row))
                    this.rowComponent.addColumn(1, this.columnElement, this.widgetService.clipboard);
                }
              },
              {
                type: MenuOptionType.Divider
              }
            ]);


            // Concat the widget options
            menuOptions = menuOptions.concat(widgetOptions);

            // Show the rest of the widget options
            menuOptions = menuOptions.concat([
              {
                type: MenuOptionType.MenuItem,
                name: 'Add widget left',
                optionFunction: () => {
                  this.rowComponent.addColumn(0, this.columnElement, new WidgetData(WidgetType.Button));
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Add widget right',
                optionFunction: () => {
                  this.rowComponent.addColumn(1, this.columnElement, new WidgetData(WidgetType.Button));
                }
              },
              {
                type: MenuOptionType.Divider
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Cut widget',
                shortcut: 'Ctrl+X',
                optionFunction: () => {
                  this.widgetService.clipboard = this.widgetService.selectedWidget.getData();
                  this.deleteColumn();
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Copy widget',
                shortcut: 'Ctrl+C',
                optionFunction: () => this.widgetService.clipboard = this.widgetService.selectedWidget.getData()
              },
              {
                type: MenuOptionType.Divider
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Duplicate widget left',
                optionFunction: () => {
                  const widgetData = this.widgetService.selectedWidget.getData();
                  this.rowComponent.addColumn(0, this.columnElement, widgetData);
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Duplicate widget right',
                optionFunction: () => {
                  const widgetData = this.widgetService.selectedWidget.getData();
                  this.rowComponent.addColumn(1, this.columnElement, widgetData);
                }
              },
              {
                type: MenuOptionType.Divider
              }
            ]);


            // Column options
            menuOptions = menuOptions.concat(this.getColumnContextMenuOptions());
            menuOptions = menuOptions.concat([{ type: MenuOptionType.Divider }]);

            // Row options
            menuOptions = menuOptions.concat(this.rowComponent.getRowContextMenuOptions());

            // Assign the options
            contextMenu.options = menuOptions;
          });
      }
    });

    window.setTimeout(() => {
      this.widgetService.onRowChange(this.rowComponent.containerComponent);
    });


    return widgetComponentRef;
  }





  // ------------------------------------------------------------------------------- Create Widget --------------------------------------------------------------------
  public async createWidget(widgetData: WidgetData): Promise<void> {
    await super.createWidget(widgetData);

    // Set the horizontal alignment
    this.horizontalAlignment.setClasses(this.widget.widgetElement);
  }




  // -------------------------------------------------------------------------- Delete Column ----------------------------------------------------------
  public deleteColumn(): void {
    if (this.rowComponent.columnCount == 1) {
      this.rowComponent.containerComponent.deleteRow(this.rowComponent);
    } else {
      this.rowComponent.deleteColumn(this);
    }

    this.widgetService.page.save();
  }


  // -------------------------------------------------------------------------- Is Widget Left ----------------------------------------------------------
  public isColumnLeft(): boolean {
    const columnIndex = this.rowComponent.columns.findIndex(x => x == this);

    return columnIndex > 0;
  }



  // -------------------------------------------------------------------------- Is Widget Right ----------------------------------------------------------
  public isColumnRight(): boolean {
    const columnIndex = this.rowComponent.columns.findIndex(x => x == this);

    return columnIndex != this.rowComponent.columns.length - 1;
  }


  // --------------------------------------------------------------------------Set Selected Widget----------------------------------------------------------------
  public setSelectedWidget(widget: Widget): void {
    this.widgetService.selectedWidget = widget;
    this.widgetService.selectedRow = this.rowComponent;
    this.widgetService.selectedColumn = this;
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Widget;
  }




  // --------------------------------------------------------------------------Update Column Span----------------------------------------------------------------
  public updateColumnSpan(): void {
    this.columnSpan.setClasses(this.columnElement);
  }


  // -------------------------------------------------------------------------------Get Widget--------------------------------------------------------------------
  public async getWidget(widgetType: WidgetType): Promise<Type<Widget>> {
    let widget!: Type<Widget>;

    switch (widgetType) {
      // Button
      case WidgetType.Button:
        const { ButtonWidgetDevComponent } = await import('../button-widget-dev/button-widget-dev.component');
        widget = ButtonWidgetDevComponent;
        break;

      // Text
      case WidgetType.Text:
        const { TextWidgetDevComponent } = await import('../text-widget-dev/text-widget-dev.component');
        widget = TextWidgetDevComponent;
        break;

      // Image
      case WidgetType.Image:
        const { ImageWidgetDevComponent } = await import('../image-widget-dev/image-widget-dev.component');
        widget = ImageWidgetDevComponent;
        break;


      // Container
      case WidgetType.Container:
        const { ContainerWidgetDevComponent } = await import('../container-widget-dev/container-widget-dev.component');
        widget = ContainerWidgetDevComponent;
        break;


      // Line
      case WidgetType.Line:
        const { LineWidgetDevComponent } = await import('../line-widget-dev/line-widget-dev.component');
        widget = LineWidgetDevComponent;
        break;


      // Video
      case WidgetType.Video:
        const { VideoWidgetDevComponent } = await import('../video-widget-dev/video-widget-dev.component');
        widget = VideoWidgetDevComponent;
        break;


      // Product Slider
      case WidgetType.ProductSlider:
        const { ProductSliderWidgetDevComponent } = await import('../product-slider-widget-dev/product-slider-widget-dev.component');
        widget = ProductSliderWidgetDevComponent;
        break;



      // Carousel
      case WidgetType.Carousel:
        const { CarouselWidgetDevComponent } = await import('../carousel-widget-dev/carousel-widget-dev.component');
        widget = CarouselWidgetDevComponent;
        break;

      // Grid
      case WidgetType.Grid:
        const { GridWidgetDevComponent } = await import('../grid-widget-dev/grid-widget-dev.component');
        widget = GridWidgetDevComponent;
        break;
    }

    return widget;
  }




  // -------------------------------------------------------------------------------On Mouseenter--------------------------------------------------------------------
  public onMouseenter(): void {
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.Allowed);
    }
  }





  // --------------------------------------------------------------------------------On Mouseleave--------------------------------------------------------------------
  public onMouseleave(): void {
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.NotAllowed);
    }
  }





  // ---------------------------------------------------------------------------On Column Indicator Mouseup------------------------------------------------------------
  public onColumnIndicatorMouseup(addend: number): void {
    this.rowComponent.addColumn(addend, this.columnElement, new WidgetData(this.widgetService.widgetCursor.widgetType));
  }






  // --------------------------------------------------------------------------------On Mousedown--------------------------------------------------------------------
  public onMousedown(event: MouseEvent): void {
    if (event.button == 2) {
      event.stopPropagation();

      this.lazyLoadingService.load(async () => {
        const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
        const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

        return {
          component: ContextMenuComponent,
          module: ContextMenuModule
        }
      }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
        contextMenu.parentObj = this;
        contextMenu.xPos = event.screenX;
        contextMenu.yPos = event.clientY + 74;
        contextMenu.options = this.getColumnContextMenuOptions();
      });
    }
  }



  // ------------------------------------------------------------------- Get Column Context Menu Options ------------------------------------------------------
  public getColumnContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: 'Cut column',
        optionFunction: () => {
          this.widgetService.clipboard = this.getData();
          this.deleteColumn();
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Copy column',
        optionFunction: () => this.widgetService.clipboard = this.getData()
      },

      {
        type: MenuOptionType.Divider
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Move column left',
        isDisabled: !this.isColumnLeft(),
        optionFunction: () => {
          this.rowComponent.moveColumn(this, -1);
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Move column right',
        isDisabled: !this.isColumnRight(),
        optionFunction: () => {
          this.rowComponent.moveColumn(this, 1);
        }
      },
      {
        type: MenuOptionType.Divider
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Duplicate column left',
        optionFunction: () => {
          const columnData = this.widgetService.selectedColumn.getData();
          this.rowComponent.addColumn(0, this.columnElement, columnData);
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Duplicate column right',
        optionFunction: () => {
          const columnData = this.widgetService.selectedColumn.getData();
          this.rowComponent.addColumn(1, this.columnElement, columnData);
        }
      },
      {
        type: MenuOptionType.Divider
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Delete column',
        optionFunction: () => this.deleteColumn()
      }
    ]
  }




  // ------------------------------------------------------------------------------- Get Data --------------------------------------------------------------------
  public getData(): Column {
    const column = new Column(this.rowComponent.getColumnSpan(this.rowComponent.columnCount), this.widget.getData());

    column.background = this.background.getData();
    column.border = this.border.getData();
    column.corners = this.corners.getData();
    column.shadow = this.shadow.getData();
    column.padding = this.padding.getData();
    column.horizontalAlignment = this.horizontalAlignment.getData();
    return column;
  }
}