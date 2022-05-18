import { ApplicationRef, Component, Input, OnChanges } from '@angular/core';
import { LazyLoadingService, Link, LinkType, SpinnerAction } from 'common';
import { TextBoxDev } from 'text-box';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnChanges {
  @Input() textBox!: TextBoxDev;

  constructor(private appRef: ApplicationRef, private lazyLoadingService: LazyLoadingService) { }

  // ---------------------------------------------------------On Changes------------------------------------------------------------------
  ngOnChanges(): void {
    if (this.textBox) {
      this.textBox.setSelectedClasses();
      this.textBox.onSelection.subscribe(() => this.appRef.tick());
    }
  }


  async onLinkClick() {
    this.lazyLoadingService.load(async () => {
      const { LinkComponent } = await import('../link/link.component');
      const { LinkModule } = await import('../link/link.module');
      return {
        component: LinkComponent,
        module: LinkModule
      }
    }, SpinnerAction.None)
      .then((linkComponent: LinkComponent) => {
        let link = this.textBox.linkStyle.getLink();

        if (link.url) this.textBox.setText();
        linkComponent.link = link;


        linkComponent.callback = () => {
          if (linkComponent.currentLinkType != LinkType.None) {
            this.textBox.linkStyle.link = linkComponent.link;
            this.textBox.linkStyle.setStyle();
          } else {
            link = this.textBox.linkStyle.getLink();

            if (link)
              this.textBox.linkStyle.removeLink();
          }

          this.textBox.setText();
        }
      });
  }
}