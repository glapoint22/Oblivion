import { ApplicationRef, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { LazyLoadingService, LinkType, SpinnerAction } from 'common';
import { TextBoxDev } from 'text-box';
import { LinkComponent } from '../link/link.component';
import { TextWidgetDevComponent } from '../text-widget-dev/text-widget-dev.component';

@Component({
  selector: 'text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent {
  @Input() textWidget!: TextWidgetDevComponent;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  public textBox!: TextBoxDev;

  constructor(private lazyLoadingService: LazyLoadingService, private appRef: ApplicationRef) { }

  ngOnChanges() {
    this.textBox = this.textWidget.textBoxDev;
    this.textBox.onChange.subscribe(() => this.onChange.emit());
    this.textBox.onSelection.subscribe(() => this.appRef.tick());
  }


  async onLinkClick(linkElement: HTMLElement) {
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
        linkComponent.setPosition = (base: ElementRef<HTMLElement>) => {
          const linkElementRect = linkElement.getBoundingClientRect();

          linkComponent.posX = linkElementRect.right - base.nativeElement.getBoundingClientRect().width;
          linkComponent.posY = linkElementRect.bottom;
        }

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