import { KeyValue } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'common';
import { PageType } from 'widgets';
import { NicheListUpdateManager } from '../../classes/niche-list-update-manager';
import { WidgetService } from '../../services/widget/widget.service';
import { ListComponent } from '../lists/list/list.component';

@Component({
  selector: 'page-properties',
  templateUrl: './page-properties.component.html',
  styleUrls: ['./page-properties.component.scss']
})
export class PagePropertiesComponent implements OnInit {
  public pageTypes: Array<KeyValue<string, number>> = new Array<KeyValue<string, number>>();
  public selectedPageType!: KeyValue<string, number>;
  public nichesList: NicheListUpdateManager = new NicheListUpdateManager(this.dataService, this.sanitizer);
  @ViewChild('listComponent') listComponent!: ListComponent;

  constructor(public widgetService: WidgetService, private dataService: DataService, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    const pageTypesArray = Object.values(PageType);

    for (let i = 0; i < pageTypesArray.length / 2; i++) {
      this.pageTypes.push({
        key: pageTypesArray[i] as string,
        value: i
      });
    }

    this.selectedPageType = this.pageTypes[0];
  }

  onBackgroundChange() {
    this.widgetService.page.setBackground(document);
    this.widgetService.page.setBackground(this.widgetService.widgetDocument);
    this.widgetService.page.save();
  }



  ngAfterViewChecked() {
    this.nichesList.listComponent = this.listComponent;
  }

  onOpen(): void {
    this.nichesList.onOpen();
  }


  onEscape(): void {
    this.nichesList.onEscape();
  }
}