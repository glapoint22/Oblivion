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
                  name: 'Add widget in container'
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

            // Show the rest of the options
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
                  this.deleteWidget();
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
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Delete widget',
                optionFunction: () => this.deleteWidget()
              },
              {
                type: MenuOptionType.Divider
              },


              {
                type: MenuOptionType.MenuItem,
                name: 'Cut column',
                optionFunction: () => {
                  this.widgetService.clipboard = this.getData();
                  this.deleteWidget();
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
                name: 'Align column left'
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Align column center'
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Align column right'
              },

              {
                type: MenuOptionType.Divider
              },




              {
                type: MenuOptionType.MenuItem,
                name: 'Cut row',
                shortcut: 'Ctrl+R',
                optionFunction: () => {
                  const row = this.rowComponent;

                  this.widgetService.clipboard = this.rowComponent.getData();
                  row.containerComponent.deleteRow(row);
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Copy row',
                shortcut: 'Ctrl+Y',
                optionFunction: () => this.widgetService.clipboard = this.rowComponent.getData()
              },
              {
                type: MenuOptionType.Divider
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Duplicate row above',
                optionFunction: () => {
                  const container = this.rowComponent.containerComponent;
                  container.duplicateRowAbove(this.rowComponent);
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Duplicate row below',
                optionFunction: () => {
                  const container = this.rowComponent.containerComponent;
                  container.duplicateRowBelow(this.rowComponent);
                }
              },
              {
                type: MenuOptionType.Divider
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Move row above',
                isDisabled: !this.rowComponent.containerComponent.isRowAbove(this.rowComponent),
                optionFunction: () => {
                  const container = this.rowComponent.containerComponent;
                  container.moveRowAbove(this.rowComponent);
                }
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Move row below',
                isDisabled: !this.rowComponent.containerComponent.isRowBelow(this.rowComponent),
                optionFunction: () => {
                  const container = this.rowComponent.containerComponent;
                  container.moveRowBelow(this.rowComponent);
                }
              },
              {
                type: MenuOptionType.Divider
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Align row top'
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Align row middle'
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Align row bottom'
              },
              {
                type: MenuOptionType.Divider
              },
              {
                type: MenuOptionType.MenuItem,
                name: 'Delete row',
                shortcut: 'Delete',
                optionFunction: () => {
                  this.rowComponent.containerComponent.deleteRow(this.rowComponent);
                }
              }
            ]);


            contextMenu.options = menuOptions;

          });
      }
    });

    window.setTimeout(() => {
      this.widgetService.onRowChange(this.rowComponent.containerComponent);
    });


    return widgetComponentRef;
  }


  // -------------------------------------------------------------------------- Delete Widget ----------------------------------------------------------
  private deleteWidget(): void {
    if (this.rowComponent.columnCount == 1) {
      this.rowComponent.containerComponent.deleteRow(this.rowComponent);
    } else {
      this.rowComponent.deleteColumn(this);
    }
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
  public setSelectedWidget(widget: Widget) {
    this.widgetService.selectedWidget = widget;
    this.widgetService.selectedRow = this.rowComponent;
    this.widgetService.selectedColumn = this;
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Widget;
  }




  // --------------------------------------------------------------------------Update Column Span----------------------------------------------------------------
  public updateColumnSpan() {
    this.columnSpan.setClasses(this.columnElement);
  }


  // --------------------------------------------------------------------------Get Widget----------------------------------------------------------------
  public async getWidget(widgetType: WidgetType) {
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


  onMouseenter() {
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.Allowed);
    }
  }

  onMouseleave() {
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.NotAllowed);
    }
  }

  onColumnIndicatorMouseup(addend: number) {
    this.rowComponent.addColumn(addend, this.columnElement, new WidgetData(this.widgetService.widgetCursor.widgetType));
  }


  onMousedown(event: MouseEvent) {
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
        contextMenu.options = [
          {
            type: MenuOptionType.MenuItem,
            name: 'Cut column'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Copy column'
          },
          {
            type: MenuOptionType.Divider,
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Align column left'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Align column center'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Align column right'
          }
        ]

      });
    }
  }


  getData(): Column {
    const column = new Column(12, this.widget.getData());

    column.background = this.background.getData();
    column.border = this.border.getData();
    column.corners = this.corners.getData();
    column.shadow = this.shadow.getData();
    column.padding = this.padding.getData();
    return column;
  }
}