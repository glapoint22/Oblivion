import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TextBoxDev } from 'text-box';
import { Enableable, TextWidgetComponent, TextWidgetData } from 'widgets';
import { BuilderType, MediaLocation, WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { UpdatedMediaReferenceId } from '../../classes/updated-media-reference-id';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'text-widget-dev',
  templateUrl: './text-widget-dev.component.html',
  styleUrls: ['./text-widget-dev.component.scss']
})
export class TextWidgetDevComponent extends TextWidgetComponent implements OnInit, Enableable {
  @ViewChild('htmlRootElement') htmlRootElement!: ElementRef<HTMLElement>;
  public textBoxDev!: TextBoxDev;
  public widgetHandle = WidgetHandle;
  public enabled!: boolean;
  public widgetInspectorView = WidgetInspectorView;
  public widgetHandleDown!: boolean;

  constructor(public widgetService: WidgetService) { super() }


  onMousemove = (event: MouseEvent) => {
    if (this.enabled && !this.widgetHandleDown) event.stopImmediatePropagation();
  }


  onWidgetHandleDown() {
    this.widgetHandleDown = true;
    this.widgetService.widgetDocument.addEventListener('mouseup', () => {
      this.widgetHandleDown = false;
    }, { once: true });
  }


  setText() {
    this.textBoxDev = new TextBoxDev(this.htmlRootElement.nativeElement);

    if (this.textBoxData && this.textBoxData.length > 0) {
      this.textBoxDev.load(this.textBoxData);
    }

    this.textBoxDev.render();
  }



  onEnabled() {
    this.enabled = true;
    this.textBoxDev.setFocus();
    this.widgetService.widgetDocument.addEventListener('mousemove', this.onMousemove);
  }



  ngDoCheck() {
    if (this.widgetService.selectedWidget != this && this.enabled) {
      this.enabled = false;
      this.widgetService.widgetDocument.removeEventListener('mousemove', this.onMousemove);
    }
  }


  getData(): TextWidgetData {
    const textWidgetData = super.getData() as TextWidgetData;

    textWidgetData.textBoxData = this.textBoxDev.getData();
    return textWidgetData;
  }

  ngOnDestroy() {
    this.widgetService.widgetDocument.removeEventListener('mousemove', this.onMousemove);
  }


  // ------------------------------------------------------------------------ Get Image Reference --------------------------------------------------
  public getMediaReference() {
    return {
      mediaId: this.background.image.id,
      imageSizeType: this.background.image.imageSizeType,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: MediaLocation.TextWidgetBackground
    }
  }



  // -------------------------------------------------------------------------- Get Reference Ids --------------------------------------------------
  public getReferenceIds(update?: boolean): Array<number> {
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
    return referenceIds;
  }
}