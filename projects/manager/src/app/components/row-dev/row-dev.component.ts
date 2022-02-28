import { Component, ComponentFactoryResolver } from '@angular/core';
import { Column, RowComponent } from 'widgets';
import { WidgetCursorType } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { ColumnDevComponent } from '../column-dev/column-dev.component';

@Component({
  selector: 'row-dev',
  templateUrl: './row-dev.component.html',
  styleUrls: ['./row-dev.component.scss']
})
export class RowDevComponent extends RowComponent {
  public columns: Array<ColumnDevComponent> = new Array<ColumnDevComponent>();

  constructor(resolver: ComponentFactoryResolver, private widgetService: WidgetService) { super(resolver); }


  createColumns(columns: Array<Column>) {
    columns.forEach((column: Column, index) => {
      this.createColumn(column, index);
    });
  }


  createColumn(column: Column, index: number): void {
    const componentFactory = this.resolver.resolveComponentFactory(ColumnDevComponent);
    const columnComponentRef = this.viewContainerRef.createComponent(componentFactory, index);

    this.columns.splice(index, 0, columnComponentRef.instance);


    columnComponentRef.instance.rowComponent = this;
    const columnComponent = columnComponentRef.instance;

    columnComponent.columnElement = columnComponentRef.location.nativeElement;

    // Set the column with the column data
    columnComponent.setColumn(column);


    // Detect changes
    columnComponentRef.hostView.detectChanges();

    // Create the widget
    columnComponent.createWidget(column.widgetData);
  }


  


  addColumn(addend: number, columnElement: HTMLElement) {
    this.columnCount++;

    const columnSpan = this.getColumnSpan(this.columnCount);
    const widgetType = this.widgetService.$widgetCursor.getValue().widgetType;

    this.columns.forEach((column: ColumnDevComponent) => {
      column.columnElement.className = '';
      column.columnSpan.value = columnSpan;
      column.columnSpan.setClass(column.columnElement);
    });


    const index = this.getColumnIndex(columnElement, addend);
    this.createColumn(new Column(columnSpan, widgetType), index);
  }

  getColumnIndex(columnElement: HTMLElement, index: number) {
    return this.columns.findIndex(x => x.columnElement == columnElement) + index;
  }


  getColumnSpan(columnCount: number): number {
    return Math.max(2, Math.floor(12 / columnCount));
  }

  onMouseup() {
    this.widgetService.clearWidgetCursor();
    document.body.className = '';
  }


  onMousemove() {
    if (document.body.id == 'widget-cursor') {
      this.widgetService.setWidgetCursorType(WidgetCursorType.NotAllowed);
      document.body.className = 'over-row';
    }
  }

  onMouseleave() {
    if (document.body.id == 'widget-cursor') {
      this.widgetService.setWidgetCursorType(WidgetCursorType.Allowed);
      document.body.className = '';
    }
  }
}