import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableHierarchyComponent } from './editable-hierarchy.component';

describe('EditableHierarchyComponent', () => {
  let component: EditableHierarchyComponent;
  let fixture: ComponentFixture<EditableHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
