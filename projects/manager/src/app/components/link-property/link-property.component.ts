import { Component, Input } from '@angular/core';
import { Link, LazyLoadingService, SpinnerAction, LinkType } from 'common';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'link-property',
  templateUrl: './link-property.component.html',
  styleUrls: ['./link-property.component.scss']
})
export class LinkPropertyComponent {
  @Input() link!: Link;
  public linkType = LinkType;

  constructor(private lazyLoadingService: LazyLoadingService) { }

  async onClick() {
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
      });
  }
}