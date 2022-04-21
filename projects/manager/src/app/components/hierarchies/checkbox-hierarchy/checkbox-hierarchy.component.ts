import { Component } from '@angular/core';
import { CheckboxHierarchyManager } from '../../../classes/checkbox-hierarchy-manager';
import { HierarchyComponent } from '../hierarchy/hierarchy.component';

@Component({
  selector: 'checkbox-hierarchy',
  templateUrl: './checkbox-hierarchy.component.html',
  styleUrls: ['./checkbox-hierarchy.component.scss']
})
export class CheckboxHierarchyComponent extends HierarchyComponent {
  public listManager!: CheckboxHierarchyManager;

  instantiate() {
    this.listManager = new CheckboxHierarchyManager(this.lazyLoadingService);
  }
}