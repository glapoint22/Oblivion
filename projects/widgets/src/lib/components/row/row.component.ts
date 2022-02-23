import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { Breakpoint } from '../../classes/breakpoint';
import { Column } from '../../classes/column';
import { Corners } from '../../classes/corners';
import { Padding } from '../../classes/padding';
import { Row } from '../../classes/row';
import { Shadow } from '../../classes/shadow';
import { VerticalAlignment } from '../../classes/vertical-alignment';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowComponent implements AfterViewInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;
  public top!: number;
  public background: Background = new Background();
  public border: Border = new Border();
  public corners: Corners = new Corners();
  public shadow: Shadow = new Shadow();
  public columnCount!: number;
  private padding: Padding = new Padding();
  private verticalAlignment!: VerticalAlignment;
  private breakpoints!: Array<Breakpoint>;

  constructor(public resolver: ComponentFactoryResolver) { }


  ngAfterViewInit(): void {
    // Get the html row element
    const rowElement = this.viewContainerRef.element.nativeElement.parentElement;
    this.padding.setClass(rowElement, this.breakpoints);
    this.verticalAlignment.setClass(rowElement, this.breakpoints);
  }


  setRow(row: Row) {
    this.top = row.top;
    this.background.setData(row.background);
    this.border.setData(row.border);
    this.corners.setData(row.corners);
    this.shadow.setData(row.shadow);
    this.breakpoints = row.breakpoints;
    this.columnCount = row.columns.length;
    this.padding.setData(row.padding);
    this.verticalAlignment = new VerticalAlignment(row.verticalAlignment);
  }

  createColumns(columns: Array<Column>) {
    columns.forEach((column: Column) => {
      this.createColumn(column);
    });
  }

  createColumn(column: Column, index?: number): void {
    const componentFactory = this.resolver.resolveComponentFactory(ColumnComponent);
    const columnComponentRef = this.viewContainerRef.createComponent(componentFactory);
    const columnComponent = columnComponentRef.instance;

    columnComponent.columnElement = columnComponentRef.location.nativeElement;

    // Set the column with the column data
    columnComponent.setColumn(column);


    // Detect changes
    columnComponentRef.hostView.detectChanges();

    // Create the widget
    columnComponent.createWidget(column.widgetData);
  }
}