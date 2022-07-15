import { Component, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, LinkType, SpinnerAction } from 'common';
import { TextBoxDev } from 'text-box';
import { Item } from '../../classes/item';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'text-toolbar-popup',
  templateUrl: './text-toolbar-popup.component.html',
  styleUrls: ['./text-toolbar-popup.component.scss']
})
export class TextToolbarPopupComponent {
  @Input() textBox!: TextBoxDev;
  public linkContainer!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService) { }



  async onLinkClick(linkElement: HTMLElement) {
    this.lazyLoadingService.load(async () => {
      const { LinkComponent } = await import('../link/link.component');
      const { LinkModule } = await import('../link/link.module');
      return {
        component: LinkComponent,
        module: LinkModule
      }
    }, SpinnerAction.None, this.linkContainer)
      .then((linkComponent: LinkComponent) => {
        let link = this.textBox.linkStyle.getLink();
        
        linkComponent.link = link;
        if (link.url) this.textBox.setText();

        linkComponent.setPosition = (base: ElementRef<HTMLElement>) => {
          const linkElementRect = linkElement.getBoundingClientRect();

          linkComponent.posX = linkElementRect.right - base.nativeElement.getBoundingClientRect().width + 8;
          linkComponent.posY = linkElementRect.bottom + 6;
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




  // ------------------------------------------------------------------------ On Case Click ----------------------------------------------------------
  async onCaseClick(element: HTMLElement) {
    this.lazyLoadingService.load(async () => {
      const { DropdownListComponent } = await import('../dropdown-list/dropdown-list.component');
      const { DropdownListModule } = await import('../dropdown-list/dropdown-list.module');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None)
      .then((dropdownList: DropdownListComponent) => {
        const rect = element.getBoundingClientRect();

        dropdownList.list = [
          {
            id: 0,
            name: 'Lower Case',
          },
          {
            id: 1,
            name: 'Upper Case',
          },
          {
            id: 2,
            name: 'Sentence Case',
          },
          {
            id: 3,
            name: 'Title Case',
          }
        ]
        dropdownList.top = rect.top + rect.height;
        dropdownList.left = rect.left;
        dropdownList.callback = (item: Item) => {
          switch (item.id) {
            case 0:
              this.textBox.lowerCase.setStyle();
              break;

            case 1:
              this.textBox.upperCase.setStyle();
              break;

            case 2:
              this.textBox.sentenceCase.setStyle();
              break;

            case 3:
              this.textBox.titleCase.setStyle();
              break;
          }

          this.textBox.setText();
        }
      });
  }
}