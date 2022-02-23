import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ContainerComponent, Row } from 'widgets';
import { WidgetCursorType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
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
    const widgetCursor: WidgetCursor = this.widgetService.$widgetCursor.getValue();

    if (widgetCursor.widgetType) {
      this.createRow(new Row(event.clientY - 4, widgetCursor.widgetType));

      // Clear the cursor
      this.widgetService.clearWidgetCursor();
    }
  }

  onContainerMousemove(event: MouseEvent, rowIndicator: HTMLElement) {
    if (document.body.id == 'widget-cursor') {
      rowIndicator.style.top = event.clientY - 4 + 'px';
    }

  }


  onContainerMouseEnter() {
    if (document.body.id == 'widget-cursor') {
      this.widgetService.setWidgetCursorType(WidgetCursorType.Allowed)
    }
  }


  onContainerMouseLeave() {
    if (document.body.id == 'widget-cursor') {
      this.widgetService.setWidgetCursorType(WidgetCursorType.NotAllowed)
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
    // If a widget is being resized, return
    if (this.widgetService.$widgetResize.getValue() != 'default') return;

    const rowElement = mousedownEvent.currentTarget as HTMLElement;
    const offset = mousedownEvent.clientY - rowElement.getBoundingClientRect().top;

    const onRowMousemove = (mousemoveEvent: MouseEvent) => {
      let newRowelementTop = Math.max(0, mousemoveEvent.clientY - offset);

      const otherRowElements = this.rowElements
        .filter(x => x != rowElement && x.getBoundingClientRect().bottom <= rowElement.getBoundingClientRect().top);

      if (otherRowElements.length > 0) {
        const total = otherRowElements
          .map(x => x.getBoundingClientRect().height)
          .reduce((a, b) => a + b);

        if (newRowelementTop <= total) newRowelementTop = total;
      }



      if (newRowelementTop + rowElement.getBoundingClientRect().height > this.viewContainerRef.element.nativeElement.parentElement.clientHeight) {
        console.log('colliding bottom container')
      }


      rowElement.style.top = newRowelementTop + 'px';

      this.collision(rowElement, newRowelementTop, newRowelementTop + rowElement.getBoundingClientRect().height);
    }

    const onRowMouseup = () => {
      window.removeEventListener('mousemove', onRowMousemove);
      window.removeEventListener('mouseup', onRowMouseup);
    }

    window.addEventListener('mousemove', onRowMousemove);
    window.addEventListener('mouseup', onRowMouseup);
  }


  collision(rowElement: HTMLElement, rowElementTop: number, rowElementBottom: number) {
    this.rowElements.filter(x => x != rowElement)
      .forEach((otherRowElement: HTMLElement) => {
        const otherRowElementClientRect = otherRowElement.getBoundingClientRect();
        const otherRowElementTop = parseInt(otherRowElement.style.top);
        const otherRowElementBottom = otherRowElementTop + otherRowElementClientRect.height;

        if (otherRowElementClientRect.bottom > this.viewContainerRef.element.nativeElement.parentElement.clientHeight) {
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
}