import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Link, LazyLoadingService, SpinnerAction, LinkType } from 'common';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'link-property',
  templateUrl: './link-property.component.html',
  styleUrls: ['./link-property.component.scss']
})
export class LinkPropertyComponent {
  @Input() link!: Link;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  public linkType = LinkType;

  constructor(private lazyLoadingService: LazyLoadingService) { }

  async onClick(propertyBoxBar: HTMLElement) {
    this.lazyLoadingService.load(async () => {
      const { LinkComponent } = await import('../link/link.component');
      const { LinkModule } = await import('../link/link.module');
      return {
        component: LinkComponent,
        module: LinkModule
      }
    }, SpinnerAction.None)
      .then((linkComponent: LinkComponent) => {
        linkComponent.link = this.link;
        linkComponent.callback = () => this.onChange.emit();
        linkComponent.setPosition = (base: ElementRef<HTMLElement>) => {
          const propertyBoxBarRect = propertyBoxBar.getBoundingClientRect();

          linkComponent.posX = propertyBoxBarRect.right - base.nativeElement.getBoundingClientRect().width + 6;
          linkComponent.posY = propertyBoxBarRect.bottom + 8;
        }

      });
  }
}