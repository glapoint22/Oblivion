import { Component, ComponentFactoryResolver } from '@angular/core';
import { Column, ColumnSpan, RowComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';
import { ColumnDevComponent } from '../column-dev/column-dev.component';
import { ContainerDevComponent } from '../container-dev/container-dev.component';

@Component({
  selector: 'row-dev',
  templateUrl: './row-dev.component.html',
  styleUrls: ['./row-dev.component.scss']
})
export class RowDevComponent extends RowComponent {
  public columns: Array<ColumnDevComponent> = new Array<ColumnDevComponent>();
  public containerComponent!: ContainerDevComponent;

  constructor(resolver: ComponentFactoryResolver, private widgetService: WidgetService) { super(resolver); }



  onRowMousedown(mousedownEvent: MouseEvent) {
    mousedownEvent.stopPropagation();

    const rowElement = mousedownEvent.currentTarget as HTMLElement;
    const offset = mousedownEvent.clientY - rowElement.getBoundingClientRect().top;
    const document = this.rowElement.getRootNode() as Document;
    const top = this.containerComponent.viewContainerRef.element.nativeElement.parentElement.getBoundingClientRect().top;

    const onRowMousemove = (mousemoveEvent: MouseEvent) => {
      let newRowelementTop = Math.max(0, mousemoveEvent.clientY - offset - top);

      const otherRowElements = this.containerComponent.rowElements
        .filter(x => x != rowElement && x.getBoundingClientRect().bottom <= rowElement.getBoundingClientRect().top);

      if (otherRowElements.length > 0) {
        const total = otherRowElements
          .map(x => x.getBoundingClientRect().height)
          .reduce((a, b) => a + b);

        if (newRowelementTop <= total) newRowelementTop = total;
      }



      if (newRowelementTop + rowElement.getBoundingClientRect().height > this.containerComponent.viewContainerRef.element.nativeElement.parentElement.clientHeight) {
        console.log('colliding bottom container')
      }

      this.top = newRowelementTop;
      rowElement.style.top = newRowelementTop + 'px';

      this.collision(rowElement, newRowelementTop, newRowelementTop + rowElement.getBoundingClientRect().height);
    }

    const onRowMouseup = () => {
      document.removeEventListener('mousemove', onRowMousemove);
      document.removeEventListener('mouseup', onRowMouseup);
    }

    document.addEventListener('mousemove', onRowMousemove);
    document.addEventListener('mouseup', onRowMouseup);
  }





  collision(rowElement: HTMLElement, rowElementTop: number, rowElementBottom: number) {
    this.containerComponent.rowElements.filter(x => x != rowElement)
      .forEach((otherRowElement: HTMLElement) => {
        const otherRowElementClientRect = otherRowElement.getBoundingClientRect();
        const otherRowElementTop = parseInt(otherRowElement.style.top);
        const otherRowElementBottom = otherRowElementTop + otherRowElementClientRect.height;

        if (otherRowElementClientRect.bottom > this.containerComponent.viewContainerRef.element.nativeElement.parentElement.clientHeight) {
          console.log('colliding bottom container')
        }

        if (rowElementTop < otherRowElementBottom && rowElementBottom > otherRowElementBottom) {
          const otherRowElementNewTop = rowElementTop - otherRowElementClientRect.height;

          otherRowElement.style.top = otherRowElementNewTop + 'px';


          this.collision(otherRowElement, otherRowElementNewTop, otherRowElementNewTop + otherRowElementClientRect.height);

        }

        else if (rowElementBottom > otherRowElementTop && rowElementTop < otherRowElementTop) {

          const otherRowElementNewTop = rowElementBottom
          otherRowElement.style.top = otherRowElementNewTop + 'px';





          this.collision(otherRowElement, otherRowElementNewTop, otherRowElementNewTop + otherRowElementClientRect.height);
        }


      });
  }




  createColumns(columns: Array<Column>) {
    columns.forEach((column: Column, index) => {
      this.createColumn(column, index);
    });
  }


  createColumn(column: Column, index: number): void {
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





  addColumn(addend: number, columnElement: HTMLElement) {
    this.columnCount++;

    const columnSpan = this.getColumnSpan(this.columnCount);
    const widgetType = this.widgetService.widgetCursor.widgetType;

    this.columns.forEach((column: ColumnDevComponent) => {
      column.columnSpan = new ColumnSpan(columnSpan);
      column.columnSpan.setClasses(column.columnElement);
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
    if (this.widgetService.widgetCursor) {
      this.widgetService.clearWidgetCursor();
    }
  }


  onMousemove() {
    if (this.widgetService.widgetCursor) {
    }
  }

  onMouseleave() {
    if (this.widgetService.widgetCursor) {
    }
  }
}