import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { KeywordsFormManager } from '../../classes/keywords-form-manager';
import { KeywordsService } from '../../services/keywords/keywords.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'keywords-form',
  templateUrl: './keywords-form.component.html',
  styleUrls: ['./keywords-form.component.scss']
})
export class KeywordsFormComponent extends LazyLoad {
  @ViewChild('hierarchyComponent') hierarchyComponent!: HierarchyComponent;
  @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;
  public keywordsFormManager: KeywordsFormManager = new KeywordsFormManager(this.dataService, this.sanitizer, this.keywordsService);
  

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer, private keywordsService: KeywordsService) {
    super(lazyLoadingService);
    this.keywordsFormManager.onClose.subscribe(() => {
      this.close();
    })
  }

  ngAfterViewChecked() {
    this.keywordsFormManager.searchComponent = this.searchComponent;
    this.keywordsFormManager.otherListComponent = this.keywordsService.productHierarchyComponent;
    this.keywordsFormManager.listComponent = this.keywordsService.formHierarchyComponent = this.hierarchyComponent;
    this.keywordsFormManager.searchInput = document.getElementById('keywordsFormSearchInput') as HTMLInputElement;
  }

  onOpen(): void {
    this.keywordsFormManager.onOpen();
  }

  onEscape(): void {
    this.keywordsFormManager.onEscape();
  }
}