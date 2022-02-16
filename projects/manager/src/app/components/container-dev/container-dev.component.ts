import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ContainerComponent, Row } from 'widgets';
import { SelectedWidgetIcon } from '../../classes/selected-widget-icon';
import { WidgetService } from '../../services/widget/widget.service';
import { RowDevComponent } from '../row-dev/row-dev.component';

@Component({
  selector: 'container-dev',
  templateUrl: './container-dev.component.html',
  styleUrls: ['./container-dev.component.scss']
})
export class ContainerDevComponent extends ContainerComponent {
  private rowElements: Array<HTMLElement> = new Array<HTMLElement>();

  constructor(resolver: ComponentFactoryResolver, private widgetService: WidgetService) { super(resolver) }


  onContainerMouseup(event: MouseEvent) {
    const selectedWidgetIcon: SelectedWidgetIcon = this.widgetService.$selectedWidgetIcon.getValue();

    // Reset the selected widget icon
    this.widgetService.$selectedWidgetIcon.next(new SelectedWidgetIcon());

    if (selectedWidgetIcon.widgetType) {
      this.createRow(new Row(event.clientY, selectedWidgetIcon.widgetType));
    }
  }


  createRowComponentRef(): ComponentRef<RowDevComponent> {
    const rowComponentFactory: ComponentFactory<RowDevComponent> = this.resolver.resolveComponentFactory(RowDevComponent);
    const rowComponentRef: ComponentRef<RowDevComponent> = this.viewContainerRef.createComponent(rowComponentFactory);
    const rowElement: HTMLElement = rowComponentRef.location.nativeElement.firstElementChild;

    rowElement.addEventListener('mousedown', this.onRowMousedown);
    this.rowElements.push(rowElement);

    return rowComponentRef;
  }


  onRowMousedown = (mousedownEvent: MouseEvent) => {
    const rowElement = mousedownEvent.currentTarget as HTMLElement;
    const offset = mousedownEvent.clientY - rowElement.getBoundingClientRect().top;

    const onRowMousemove = (mousemoveEvent: MouseEvent) => {
      const top = mousemoveEvent.clientY - offset;
      const delta = top - parseInt(rowElement.style.top);

      if (delta < 0) {
        const otherRowElements = this.rowElements.filter(x => x != rowElement && x.getBoundingClientRect().bottom <= rowElement.getBoundingClientRect().top);
        
        
      }


      rowElement.style.top = top + 'px';



      this.trumpy(rowElement, top, rowElement.getBoundingClientRect().bottom + delta);

    }

    const onRowMouseup = () => {
      window.removeEventListener('mousemove', onRowMousemove);
      window.removeEventListener('mouseup', onRowMouseup);
    }

    window.addEventListener('mousemove', onRowMousemove);
    window.addEventListener('mouseup', onRowMouseup);
  }


  trumpy(rowElement: HTMLElement, top: number, bottom: number) {
    this.rowElements.filter(x => x != rowElement)
      .forEach((otherRowElement: HTMLElement) => {
        const otherClientRect = otherRowElement.getBoundingClientRect();

        if (top < otherClientRect.bottom && bottom > otherClientRect.bottom) {
          const diff = top - otherClientRect.bottom;
          const otherTop = otherClientRect.top + diff;
          const delta = otherTop - parseInt(otherRowElement.style.top);

          otherRowElement.style.top = otherTop + 'px';

          this.trumpy(otherRowElement, otherTop, otherClientRect.bottom + delta);
        }


      });
  }
}