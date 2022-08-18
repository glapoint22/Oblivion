import { ApplicationRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContainerWidgetComponent, ContainerWidgetData } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { BuilderType, MediaLocation, WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { UpdatedMediaReferenceId } from '../../classes/updated-media-reference-id';
import { WidgetService } from '../../services/widget/widget.service';
import { ColumnDevComponent } from '../column-dev/column-dev.component';
import { ContainerDevComponent } from '../container-dev/container-dev.component';
import { RowDevComponent } from '../row-dev/row-dev.component';

@Component({
  selector: 'container-widget-dev',
  templateUrl: './container-widget-dev.component.html',
  styleUrls: ['./container-widget-dev.component.scss']
})
export class ContainerWidgetDevComponent extends ContainerWidgetComponent implements ContainerHost {
  public widgetHandle = WidgetHandle;
  public hostContainer!: ContainerDevComponent;
  public widgetInspectorView = WidgetInspectorView;
  public columnComponent!: ColumnDevComponent;
  private fixedHeight!: number;

  constructor(public widgetService: WidgetService, private appRef: ApplicationRef) { super() }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const container = this.container as ContainerDevComponent;

    container.host = this;
    this.fixedHeight = this.height;
  }


  onWidgetHandleMousedown(widgetHandle: WidgetHandle, event: MouseEvent) {
    this.widgetService.onWidgetHandleMousedown(widgetHandle, event);
    this.widgetService.widgetDocument.addEventListener('mouseup', () => this.fixedHeight = this.height, { once: true });
  }



  onRowChange(maxBottom: number): void {
    this.height = Math.max(this.fixedHeight, maxBottom);
    this.appRef.tick();
    this.widgetService.manageRowCollision(this.columnComponent.rowComponent);
    this.widgetService.onRowChange(this.hostContainer);
  }


  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): ContainerWidgetData {
    const containerWidgetData = super.getData() as ContainerWidgetData;
    const container = this.container as ContainerDevComponent;

    containerWidgetData.rows = [];

    container.rows.forEach((row: RowDevComponent) => {
      containerWidgetData.rows.push(row.getData());
    });

    return containerWidgetData;
  }



  // ------------------------------------------------------------------------ Get Image Reference --------------------------------------------------
  public getMediaReference(): MediaReference {
    return {
      mediaId: this.background.image.id,
      imageSizeType: this.background.image.imageSizeType,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: MediaLocation.ContainerWidgetBackground
    }
  }





  // -------------------------------------------------------------------------- Get Reference Ids --------------------------------------------------
  public getReferenceIds(update?: boolean): Array<number> {
    const container = this.container as ContainerDevComponent;
    let referenceIds: Array<number> = new Array<number>();

    if (this.background.image && this.background.image.src) {
      referenceIds.push(this.background.image.referenceId);

      if (update) {
        const subscription: Subscription = this.widgetService.$mediaReferenceUpdate
          .subscribe((updatedMediaReferenceIds: Array<UpdatedMediaReferenceId>) => {
            const referenceId = updatedMediaReferenceIds.find(x => x.oldId == this.background.image.referenceId)?.newId;
            this.background.image.referenceId = referenceId!;
            subscription.unsubscribe();
          });
      }
    }

    container.rows.forEach((row: RowDevComponent) => {
      referenceIds = row.getReferenceIds(update).concat(referenceIds);
    });

    return referenceIds;
  }
}