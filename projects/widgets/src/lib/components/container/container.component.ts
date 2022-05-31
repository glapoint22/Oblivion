import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Row } from '../../classes/row';
import { RowComponent } from '../row/row.component';

@Component({
  selector: 'container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;

  constructor(public resolver: ComponentFactoryResolver) { }


  createRow(row: Row): void {
    // Create the new row
    const rowComponentRef = this.createRowComponentRef(row.top);
    const rowComponent = rowComponentRef.instance;

    // Set the row with the row data
    rowComponent.setRow(row);


    // Detect changes
    rowComponentRef.hostView.detectChanges();


    // Create the columns
    rowComponent.createColumns(row.columns);
  }


  createRowComponentRef(top: number): ComponentRef<RowComponent> {
    const rowComponentFactory: ComponentFactory<RowComponent> = this.resolver.resolveComponentFactory(RowComponent);
    return this.viewContainerRef.createComponent(rowComponentFactory);
  }
}