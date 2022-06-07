import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, Link, LinkType } from 'common';
import { LinkItem } from '../../classes/link-item';

@Component({
  selector: 'link-property',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent extends LazyLoad {
  @ViewChild('linkInput') linkInput!: ElementRef<HTMLInputElement>;
  public link!: Link;
  public linkType = LinkType;
  public searchResults!: Array<LinkItem>;
  public apiUrl!: string;
  public callback!: Function;
  public currentLinkType!: LinkType;
  public currentUrl!: string;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) { super(lazyLoadingService) }



  // ---------------------------------------------------------------------Ng On Init----------------------------------------------------
  public ngOnInit(): void {
    super.ngOnInit();
    this.setApiUrl();
    this.currentLinkType = this.link.linkType;
    this.currentUrl = this.link.url;
  }




  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (this.currentLinkType == LinkType.WebAddress) {
      this.linkInput.nativeElement.select();
    }
  }


  // -------------------------------------------------------------------------Search----------------------------------------------------------
  public search(searchWords: string) {
    if (this.currentLinkType != LinkType.WebAddress) {
      this.dataService.get<Array<LinkItem>>(this.apiUrl, [{ key: 'searchTerm', value: searchWords }])
        .subscribe((results: Array<LinkItem>) => {
          this.searchResults = results;
        });
    } else {
      this.currentUrl = searchWords;
    }
  }






  // ------------------------------------------------------------------------Set Link Type------------------------------------------------------
  public setLinkType(linkType: LinkType) {
    this.currentLinkType = linkType;
    this.linkInput.nativeElement.value = '';
    this.currentUrl = null!;
    this.searchResults = [];
    this.setApiUrl();
  }






  // -------------------------------------------------------------------------Set Api Url-------------------------------------------------------
  public setApiUrl() {
    this.apiUrl = this.link.linkType == LinkType.Page ? 'api/Pages/Link' : 'api/Products/Link';
  }









  // ---------------------------------------------------------------------------Set Link----------------------------------------------------------
  public setLink(url: string) {
    // Retrun if there are search results
    if (this.searchResults && this.searchResults.length > 0) return;
    
    this.link.url = url;
    this.link.linkType = this.currentLinkType;
    this.close();
    if (this.callback) this.callback();
  }




  // ---------------------------------------------------------------------------On Escape----------------------------------------------------------
  onEscape(): void {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults = [];
    } else {
      super.onEscape();
    }
  }
}
