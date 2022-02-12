import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Column } from '../../classes/column';
import { Row } from '../../classes/row';
import { RowComponent } from '../row/row.component';

@Component({
  selector: 'container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) { }


  createRow(row: Row): void {
    // Create the new row
    const rowComponentFactory: ComponentFactory<RowComponent> = this.resolver.resolveComponentFactory(RowComponent);
    const rowComponentRef: ComponentRef<RowComponent> = this.viewContainerRef.createComponent(rowComponentFactory);
    const rowComponent = rowComponentRef.instance;

    // Set the row with the row data
    rowComponent.setRow(row);


    // Detect changes
    rowComponentRef.hostView.detectChanges();


    // Loop through each column
    row.columns.forEach((column: Column) => {
      rowComponent.createColumn(column);
    });
  }
}