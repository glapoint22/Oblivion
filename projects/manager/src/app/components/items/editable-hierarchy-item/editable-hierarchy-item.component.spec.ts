import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableHierarchyItemComponent } from './editable-hierarchy-item.component';

describe('EditableHierarchyItemComponent', () => {
  let component: EditableHierarchyItemComponent;
  let fixture: ComponentFixture<EditableHierarchyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableHierarchyItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableHierarchyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
