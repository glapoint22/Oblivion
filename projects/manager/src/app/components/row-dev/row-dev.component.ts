import { Component, ComponentRef } from '@angular/core';
import { RowComponent } from 'widgets';
import { ColumnDevComponent } from '../column-dev/column-dev.component';

@Component({
  selector: 'row-dev',
  templateUrl: './row-dev.component.html',
  styleUrls: ['./row-dev.component.scss']
})
export class RowDevComponent extends RowComponent {

  createColumnComponentRef(): ComponentRef<ColumnDevComponent> {
    const componentFactory = this.resolver.resolveComponentFactory(ColumnDevComponent);
    return this.viewContainerRef.createComponent(componentFactory);
  }
}