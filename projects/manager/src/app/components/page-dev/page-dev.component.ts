import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, Image, LazyLoadingService, Link, LinkType, SpinnerAction, Video } from 'common';
import { debounceTime, Subject } from 'rxjs';
import { Background, BackgroundImage, Caption, ColumnSpan, PageComponent, PageContent, PageType } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { BuilderType, WidgetInspectorView } from '../../classes/enums';
import { PageData } from '../../classes/page-data';
import { Query } from '../../classes/query';
import { QueryElement } from '../../classes/query-element';
import { QueryRow } from '../../classes/query-row';
import { WidgetService } from '../../services/widget/widget.service';
import { ContainerDevComponent } from '../container-dev/container-dev.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  selector: 'page-dev',
  templateUrl: './page-dev.component.html',
  styleUrls: ['./page-dev.component.scss']
})
export class PageDevComponent extends PageComponent implements ContainerHost {
  public id: number = 0;
  public name!: string;
  public pageType: PageType = PageType.Custom;
  public builderType!: BuilderType;
  public BuilderType = BuilderType;
  public host!: ContainerHost;
  public widgetInspectorView = WidgetInspectorView;
  public container!: ContainerDevComponent;
  private saveData = new Subject<void>();
  private apiUrl!: string;

  constructor
    (
      public widgetService: WidgetService,
      private dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private sanitizer: DomSanitizer
    ) { super(); }


  // --------------------------------------------------------------------------- Ng On Init ---------------------------------------------------------
  public ngOnInit(): void {
    this.widgetService.page = this;
    this.apiUrl = this.builderType == BuilderType.Page ? 'api/Pages' : 'api/Emails';

    this.saveData
      .pipe(debounceTime(200))
      .subscribe(() => {
        const container = this.container as ContainerDevComponent;

        // Get the updated rows
        this.pageContent.rows = container.getData();

        // Update the database
        this.dataService.put(this.apiUrl, {
          id: this.id,
          name: this.name,
          pageType: this.pageType,
          content: this.widgetService.stringify(this.pageContent)
        }).subscribe();
      });
  }






  // // --------------------------------------------------------------------------- Stringify ---------------------------------------------------------
  // stringify() {
  //   return JSON.stringify(this.pageContent, (key, value) => {
  //     if (
  //       (typeof value != 'number' && !value) ||
  //       (typeof value == 'object' && Object.values(value).length == 0) ||
  //       (value instanceof Background && !value.enabled) ||
  //       (value instanceof ColumnSpan && value.values.length == 1 && value.values[0].span == 12)
  //     ) {
  //       return undefined;
  //     }

  //     // Background Image
  //     else if (value instanceof BackgroundImage) {
  //       if (value.id) {
  //         return {
  //           id: value.id,
  //           imageSizeType: value.imageSizeType,
  //           position: value.position,
  //           repeat: value.repeat,
  //           attachment: value.attachment
  //         }
  //       } else {
  //         return undefined;
  //       }

  //     }

  //     // Image
  //     else if (value instanceof Image) {
  //       return {
  //         id: value.id,
  //         imageSizeType: value.imageSizeType,
  //       }
  //     }

  //     // Video
  //     else if (value instanceof Video) {
  //       return {
  //         id: value.id
  //       }
  //     }

  //     // Caption
  //     else if (value instanceof Caption) {
  //       return {
  //         font: value.font,
  //         fontSize: value.fontSize,
  //         fontWeight: value.fontWeight,
  //         fontStyle: value.fontStyle,
  //         textDecoration: value.textDecoration,
  //         text: value.text,
  //         color: value.color
  //       }
  //     }

  //     // Link
  //     else if (value instanceof Link) {
  //       if (value.linkType == LinkType.Page || value.linkType == LinkType.Product) {
  //         return {
  //           id: value.id,
  //           linkType: value.linkType
  //         }
  //       } else {
  //         return {
  //           linkType: value.linkType,
  //           url: value.url,
  //         }
  //       }
  //     }


  //     // Query
  //     else if (value instanceof Query) {
  //       return {
  //         elements: value.elements
  //       }
  //     }


  //     // Query Element
  //     else if (value instanceof QueryElement) {
  //       if (value.element instanceof QueryRow) {

  //         // Query Row
  //         return {
  //           queryElementType: value.queryElementType,
  //           queryRow: {
  //             queryType: value.element.queryType,
  //             logicalOperatorType: value.element.logicalOperatorType,
  //             comparisonOperatorType: value.element.comparisonOperatorType,
  //             item: value.element.item ? {
  //               id: value.element.item?.id
  //             } : null,
  //             integer: value.element.integer,
  //             date: value.element.date,
  //             price: value.element.price,
  //             auto: value.element.auto
  //           }
  //         }
  //       } else {

  //         // Query Group
  //         return {
  //           queryElementType: value.queryElementType,
  //           queryGroup: {
  //             query: value.element.query
  //           }
  //         }
  //       }
  //     }

  //     // Other
  //     else {
  //       return value;
  //     }
  //   });
  // }



  // ----------------------------------------------------------------------- Ng After View Init --------------------------------------------------------
  public ngAfterViewInit(): void {
    const container = this.container as ContainerDevComponent;
    container.host = this;
  }







  // ----------------------------------------------------------------------------- Get Data --------------------------------------------------------------
  public getData(pageId: number): void {
    this.clear();

    this.dataService.get<PageData>(this.apiUrl, [{ key: 'id', value: pageId }])
      .subscribe((pageData: PageData) => {
        this.setData(pageData);
      });
  }






  // ----------------------------------------------------------------------------- Set Data --------------------------------------------------------------
  public setData(pageData: PageData): void {
    this.id = pageData.id;
    this.name = pageData.name;
    this.pageType = pageData.pageType;

    this.pageContent = new PageContent();
    this.pageContent.setData(pageData.content);
    this.load();
  }







  // ------------------------------------------------------------------------------- Load -------------------------------------------------------------------
  public load(): void {
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;
    super.load();
  }



  // -------------------------------------------------------------------------------- New -------------------------------------------------------------------
  public new(): void {
    this.clear();
    this.name = this.builderType == BuilderType.Page ? 'Custom Page' : 'None';
    this.pageContent = new PageContent();

    if (this.builderType == BuilderType.Email) {
      this.pageContent.background.enabled = true;
      this.pageContent.background.color = '#ffffff';
      this.setBackground();
    }


    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;

    this.dataService.post<number>(this.apiUrl, {
      name: this.name,
      pageType: this.pageType,
      content: this.pageContent.toString()
    }).subscribe((pageId: number) => {
      this.id = pageId;
    });
  }



  // --------------------------------------------------------------------------- Set Background --------------------------------------------------------------
  public setBackground(): void {
    super.setBackground(this.widgetService.widgetDocument.body);
  }






  // -------------------------------------------------------------------------------- Save -------------------------------------------------------------------
  public save(): void {
    this.saveData.next();
  }





  // -------------------------------------------------------------------------------- Delete -------------------------------------------------------------------
  public delete(): void {
    if (this.id == 0) return;

    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None)
      .then((prompt: PromptComponent) => {
        prompt.title = this.builderType == BuilderType.Page ? 'Delete Page' : 'Delete Email';
        prompt.message = this.sanitizer.bypassSecurityTrustHtml(
          'The ' + (this.builderType == BuilderType.Page ? 'page' : 'email ') + '<span style="color: #ffba00">\"' + this.name + '\"</span>' +
          ' will be permanently deleted.');
        prompt.primaryButton.name = 'Delete';
        prompt.primaryButton.buttonFunction = () => {
          this.deletePage();
          this.widgetService.currentWidgetInspectorView = WidgetInspectorView.None;
        }
        prompt.secondaryButton.name = 'Cancel';
      });
  }








  // ----------------------------------------------------------------------------- Delete Page -------------------------------------------------------------------
  private deletePage(): void {
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.None;

    this.dataService.delete(this.apiUrl, { pageId: this.id })
      .subscribe(() => {
        this.clear();
      });
  }



  // --------------------------------------------------------------------------------- Clear -----------------------------------------------------------------------
  public clear(): void {
    if (this.id == 0) return;
    this.id = 0;
    this.clearBackground(this.widgetService.widgetDocument.body);
    this.name = null!;
    this.pageType = PageType.Custom;
    this.pageContent = null!;
    this.container.viewContainerRef.clear();
    (this.container as ContainerDevComponent).rows = [];
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.None;
  }








  // ------------------------------------------------------------------------------- Duplicate -----------------------------------------------------------------------
  public duplicate(): void {
    if (this.id == 0) return;

    this.dataService.post<number>(this.apiUrl + '/Duplicate', {
      id: this.id
    }).subscribe((pageId: number) => {
      this.getData(pageId);
    });
  }







  // ------------------------------------------------------------------------------- On Row Change ---------------------------------------------------------------------
  public onRowChange(maxBottom: number): void {
    this.host.onRowChange(maxBottom);
  }
}