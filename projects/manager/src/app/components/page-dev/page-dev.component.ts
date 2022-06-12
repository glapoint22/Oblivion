import { Component } from '@angular/core';
import { DataService } from 'common';
import { debounceTime, Subject } from 'rxjs';
import { PageComponent, PageContent, PageType } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { ListItem } from '../../classes/list-item';
import { PageData } from '../../classes/page-data';
import { WidgetService } from '../../services/widget/widget.service';
import { ContainerDevComponent } from '../container-dev/container-dev.component';

@Component({
  selector: 'page-dev',
  templateUrl: './page-dev.component.html',
  styleUrls: ['./page-dev.component.scss']
})
export class PageDevComponent extends PageComponent implements ContainerHost {
  public id!: number;
  public name!: string;
  public pageType: PageType = PageType.Custom;
  public host!: ContainerHost;
  private saveData = new Subject<void>();

  constructor(private widgetService: WidgetService, private dataService: DataService) { super(); }

  ngOnInit() {
    this.widgetService.page = this;

    this.saveData
      .pipe(debounceTime(200))
      .subscribe(() => {
        console.log('saving')
        const container = this.container as ContainerDevComponent;

        // Get the updated rows
        this.pageContent.rows = container.getData();

        // Update the database
        this.dataService.put('api/Pages', {
          id: this.id,
          name: this.name,
          pageType: this.pageType,
          content: this.pageContent.toString()
        }).subscribe();
      });
  }

  ngAfterViewInit(): void {
    const container = this.container as ContainerDevComponent;
    container.host = this;
  }

  getData(pageId: number) {
    this.dataService.get<PageData>('api/Pages', [{ key: 'id', value: pageId }])
      .subscribe((pageData: PageData) => {
        this.setData(pageData);
      });
  }


  setData(pageData: PageData) {
    this.id = pageData.id;
    this.name = pageData.name;
    this.pageType = pageData.pageType;

    this.pageContent = new PageContent();
    this.pageContent.setData(pageData.content);
    this.load();
  }

  new(content?: PageContent) {
    this.name = 'Untitled';
    this.pageContent = new PageContent();

    this.dataService.post<number>('api/Pages', {
      name: this.name,
      pageType: this.pageType,
      content: content ? content.toString() : null
    }).subscribe((pageId: number) => {
      this.id = pageId;
    });
  }


  load(): void {
    this.setBackground(this.widgetService.widgetDocument);
    super.load()
  }


  save() {
    this.saveData.next();
  }



  onRowChange(maxBottom: number) {
    this.host.onRowChange(maxBottom);
  }


  onMousedown() {
    if (!this.pageContent) return;

    this.widgetService.deselectWidget();
  }
}