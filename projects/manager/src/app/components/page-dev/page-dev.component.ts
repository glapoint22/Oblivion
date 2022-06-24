import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { debounceTime, Subject } from 'rxjs';
import { PageComponent, PageContent, PageType } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { WidgetInspectorView } from '../../classes/enums';
import { PageData } from '../../classes/page-data';
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
  public host!: ContainerHost;
  public widgetInspectorView = WidgetInspectorView;
  private saveData = new Subject<void>();

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

    this.saveData
      .pipe(debounceTime(200))
      .subscribe(() => {
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






  // ----------------------------------------------------------------------- Ng After View Init --------------------------------------------------------
  public ngAfterViewInit(): void {
    const container = this.container as ContainerDevComponent;
    container.host = this;
  }







  // ----------------------------------------------------------------------------- Get Data --------------------------------------------------------------
  public getData(pageId: number): void {
    this.clear();

    this.dataService.get<PageData>('api/Pages', [{ key: 'id', value: pageId }])
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
    this.name = 'Untitled';
    this.pageContent = new PageContent();
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;

    this.dataService.post<number>('api/Pages', {
      name: this.name,
      pageType: this.pageType
    }).subscribe((pageId: number) => {
      this.id = pageId;
    });
  }



  // --------------------------------------------------------------------------- Set Background --------------------------------------------------------------
  public setBackground(): void {
    // super.setBackground(document);
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
        prompt.title = 'Delete Page';
        prompt.message = this.sanitizer.bypassSecurityTrustHtml(
          'The page <span style="color: #ffba00">\"' + this.name + '\"</span>' +
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

    this.dataService.delete('api/Pages', { pageId: this.id })
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

    this.dataService.post<number>('api/Pages/Duplicate', {
      id: this.id
    }).subscribe((pageId: number) => {
      this.getData(pageId);
    });
  }







  // ------------------------------------------------------------------------------- On Row Change ---------------------------------------------------------------------
  public onRowChange(maxBottom: number): void {
    this.host.onRowChange(maxBottom);
  }







  // -------------------------------------------------------------------------------- On Mousedown ----------------------------------------------------------------------
  public onMousedown(): void {
    if (!this.pageContent) return;

    this.widgetService.deselectWidget();
  }
}