import { Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
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
  @ViewChild('caseDropdownListContainer', { read: ViewContainerRef }) caseDropdownListContainer!: ViewContainerRef;
  @ViewChild('linkContainer', { read: ViewContainerRef }) linkContainer!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService) { }

  ngOnChanges() {
    if (this.textBox) {
      this.textBox.onMousedown
        .subscribe(() => {
          this.clearContainers();
        });
    }
  }

  clearContainers() {
    this.caseDropdownListContainer.clear();
    this.linkContainer.clear();
  }


  async onLinkClick(linkElement: HTMLElement) {
    if (this.linkContainer.length > 0) {
      this.linkContainer.clear();
      return;
    }

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

          linkComponent.posX = -266;
          linkComponent.posY = 33;
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




  // ------------------------------------------------------------------------ Show Case Dropdown List ----------------------------------------------------------
  async showCaseDropdownList(element: HTMLElement) {
    if (this.caseDropdownListContainer.length > 0) {
      this.caseDropdownListContainer.clear();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { DropdownListComponent } = await import('../dropdown-list/dropdown-list.component');
      const { DropdownListModule } = await import('../dropdown-list/dropdown-list.module');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None, this.caseDropdownListContainer)
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
        // dropdownList.top = rect.top + rect.height;
        // dropdownList.left = rect.left;
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