import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
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
  public background!: Background;
  public border!: Border;
  public corners!: Corners;
  public shadow!: Shadow;
  public padding!: Padding;
  public verticalAlignment!: VerticalAlignment;
  public breakpoints!: Array<Breakpoint>;
  public columnCount!: number;

  constructor(private resolver: ComponentFactoryResolver) { }


  ngAfterViewInit(): void {
      // Get the html row element
    const rowElement = this.viewContainerRef.element.nativeElement.parentElement;
    this.padding.addClasses(rowElement, this.breakpoints);
    this.verticalAlignment.addClasses(rowElement, this.breakpoints);
  }


  setRow(row: Row) {
    this.top = row.top;
    this.background = row.background;
    this.border = row.border;
    this.corners = row.corners;
    this.shadow = row.shadow;
    this.breakpoints = row.breakpoints;
    this.columnCount = row.columns.length;
    this.padding = new Padding(row.padding);
    this.verticalAlignment = new VerticalAlignment(row.verticalAlignment);
  }

  createColumn(column: Column): void {
    const componentFactory = this.resolver.resolveComponentFactory(ColumnComponent);
    const columnComponentRef = this.viewContainerRef.createComponent(componentFactory);
    const columnComponent = columnComponentRef.instance;

    // Set the column with the column data
    columnComponent.setColumn(column);


    // Detect changes
    columnComponentRef.hostView.detectChanges();

    // Create the widget
    columnComponent.createWidget(column.widgetData);
  }
}