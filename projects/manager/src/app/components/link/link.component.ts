import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Link, LinkType, RadioButtonLazyLoad } from 'common';
import { Item } from '../../classes/item';
import { LinkItem } from '../../classes/link-item';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'link-property',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent extends RadioButtonLazyLoad {
  @ViewChild('linkInput') linkInput!: ElementRef<HTMLInputElement>;
  @ViewChild('search') search!: SearchComponent;
  public link!: Link;
  public linkType = LinkType;
  public apiUrl!: string;
  public callback!: Function;
  public currentLinkType!: LinkType;
  public isApplyButtonDisabled!: boolean;
  private linkItem!: LinkItem;
  public posX!: number;
  public posY!: number;
  public setPosition!: Function;



  // ---------------------------------------------------------------------Ng On Init----------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();

    this.currentLinkType = this.link.linkType;
    if (this.currentLinkType != LinkType.None) {
      this.isApplyButtonDisabled = true;
    }

    this.setApiUrl();
  }




  // -------------------------------------------------------------------Ng After View Init-------------------------------------------------
  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    window.setTimeout(() => {
      if (this.currentLinkType == LinkType.WebAddress) {
        this.linkInput.nativeElement.value = this.link.url;
        this.linkInput.nativeElement.select();
      } else if (this.currentLinkType == LinkType.Page || this.currentLinkType == LinkType.Product || this.currentLinkType == LinkType.Browse) {
        this.search.searchInput.nativeElement.value = this.link.name;
      }
    });
  }


  onOpen(): void {
    this.setPosition(this.base);
  }





  // -------------------------------------------------------------------On Search Item Select-------------------------------------------------
  onSearchItemSelect(item: Item) {
    this.linkItem = item as LinkItem;
    this.isApplyButtonDisabled = false;
  }




  // ------------------------------------------------------------------------Set Link Type------------------------------------------------------
  public setLinkType(linkType: LinkType) {
    this.currentLinkType = linkType;
    this.linkItem = null!;
    this.setApiUrl();
  }






  // -------------------------------------------------------------------------Set Api Url-------------------------------------------------------
  public setApiUrl() {
    if (this.currentLinkType == LinkType.Page) {
      this.apiUrl = 'Pages/LinkSearch';
    } else if (this.currentLinkType == LinkType.Product) {
      this.apiUrl = 'Products/LinkSearch';
    } else if (this.currentLinkType == LinkType.Browse) {
      this.apiUrl = 'Subniches/LinkSearch';
    }
  }









  // ---------------------------------------------------------------------------Set Link----------------------------------------------------------
  public setLink() {
    if (document.getElementById('dropdownList')) return;

    this.link.linkType = this.currentLinkType;

    if (this.link.linkType == LinkType.WebAddress) {
      this.link.url = this.linkInput.nativeElement.value;
    } else if (this.link.linkType == LinkType.Page || this.link.linkType == LinkType.Product || this.link.linkType == LinkType.Browse) {
      if (!this.linkItem) return;

      this.link.id = this.linkItem.id!;
      this.link.url = this.linkItem.link;
      this.link.name = this.linkItem.name!;
    } else if (this.link.linkType == LinkType.None) {
      this.link.url = null!;
      this.link.name = null!;
    }


    this.close();
    if (this.callback) this.callback();
  }




  // ---------------------------------------------------------------------------On Escape----------------------------------------------------------
  onEscape(): void {
    if (document.getElementById('dropdownList')) return;

    super.onEscape();
  }

  // ---------------------------------------------------------------------- On Window Mousedown ----------------------------------------------------
  @HostListener('window:mousedown')
  onWindowMousedown() {
    this.close();
  }


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    switch (this.tabElements.indexOf(radioButton)) {
      case 0:
        this.setLinkType(LinkType.None);
        this.isApplyButtonDisabled = false;
        break;

      case 1:
        this.setLinkType(LinkType.Page);
        this.search ? this.search.clear() : null;
        this.isApplyButtonDisabled = true
        break;

      case 2:
        this.setLinkType(LinkType.Product);
        this.search ? this.search.clear() : null;
        this.isApplyButtonDisabled = true
        break;

      case 3:
        this.setLinkType(LinkType.WebAddress);
        this.isApplyButtonDisabled = true
        break;

      case 4:
        this.setLinkType(LinkType.Browse);
        this.search ? this.search.clear() : null;
        this.isApplyButtonDisabled = true
        break;
    }
  }
}