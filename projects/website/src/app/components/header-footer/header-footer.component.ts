import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MessageComponent } from '../message/message.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { Breadcrumb } from '../../classes/breadcrumb';

@Component({
  selector: 'header-footer',
  templateUrl: './header-footer.component.html',
  styleUrls: ['./header-footer.component.scss']
})
export class HeaderFooterComponent {
  @Input() breadcrumbs!: Array<Breadcrumb>;
  @ViewChild('headerComponent') headerComponent!: HeaderComponent;
  @ViewChild('messageComponent') messageComponent!: MessageComponent;
  @ViewChild('breadcrumbsComponent') breadcrumbsComponent!: BreadcrumbsComponent;

  private headerComponentHeight: number = 0;
  private messageComponentHeight: number = 0;
  private breadcrumbsComponentHeight: number = 0;

  public get messageComponentTop(): number {
    return this.headerComponentHeight;
  }

  public get breadcrumbsComponentTop(): number {
    return this.headerComponentHeight + this.messageComponentHeight;
  }

  public get pageTop(): number {
    return this.headerComponentHeight + this.messageComponentHeight + this.breadcrumbsComponentHeight;
  }


  private setHeights(): void {
    if (this.headerComponent && this.messageComponent && this.breadcrumbsComponent) {
      this.headerComponentHeight = this.headerComponent.height;
      this.messageComponentHeight = this.messageComponent.height;
      this.breadcrumbsComponentHeight = this.breadcrumbsComponent.height;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setHeights();
    });
  }

  onMessageChange() {
    this.setHeights();
  }


  @HostListener('window:resize')
  onWindowResize() {
    this.setHeights();
  }
}