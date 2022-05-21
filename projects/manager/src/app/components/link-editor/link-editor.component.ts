import { Component, Input } from '@angular/core';
import { LazyLoadingService, Link, SpinnerAction } from 'common';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'link-editor',
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.scss']
})
export class LinkEditorComponent {
  @Input() link!: Link;

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