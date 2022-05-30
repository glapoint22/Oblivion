import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ContainerComponent, Row } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { WidgetCursorType } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { RowDevComponent } from '../row-dev/row-dev.component';

@Component({
  selector: 'container-dev',
  templateUrl: './container-dev.component.html',
  styleUrls: ['./container-dev.component.scss']
})
export class ContainerDevComponent extends ContainerComponent {
  public rows: Array<RowDevComponent> = new Array<RowDevComponent>();
  public showRowIndicator!: boolean;
  public host!: ContainerHost;

  constructor(resolver: ComponentFactoryResolver, private widgetService: WidgetService) { super(resolver) }


  ngOnInit() {
    this.widgetService.$onContainerMousemove.subscribe((containerDevComponent: ContainerDevComponent) => {
      if (containerDevComponent == this) {
        this.showRowIndicator = true;
      } else {
        this.showRowIndicator = false;
      }
    });
  }


  onContainerMouseup(event: MouseEvent) {
    if (this.widgetService.widgetCursor) {
      const top = this.viewContainerRef.element.nativeElement.parentElement.getBoundingClientRect().top;

      this.createRow(new Row(event.clientY - top, this.widgetService.widgetCursor.widgetType));
      this.widgetService.clearWidgetCursor();
    }
  }

  onContainerMousemove(event: MouseEvent, rowIndicator: HTMLElement) {
    if (this.widgetService.widgetCursor) {
      event.stopPropagation();

      const top = this.viewContainerRef.element.nativeElement.parentElement.getBoundingClientRect().top;

      this.widgetService.$onContainerMousemove.next(this);
      rowIndicator.style.top = event.clientY - top + 'px';
    }
  }


  onContainerMouseEnter() {
    this.showRowIndicator = false;
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.Allowed);
    }
  }


  onContainerMouseLeave() {
    this.showRowIndicator = false;
    if (this.widgetService.widgetCursor) {
      this.widgetService.setWidgetCursorType(WidgetCursorType.NotAllowed);
    }
  }


  createRowComponentRef(): ComponentRef<RowDevComponent> {
    const rowComponentFactory: ComponentFactory<RowDevComponent> = this.resolver.resolveComponentFactory(RowDevComponent);
    const rowComponentRef: ComponentRef<RowDevComponent> = this.viewContainerRef.createComponent(rowComponentFactory);
    const rowComponent: RowDevComponent = rowComponentRef.instance;

    this.rows.push(rowComponent);
    rowComponent.containerComponent = this;
    return rowComponentRef;
  }
}