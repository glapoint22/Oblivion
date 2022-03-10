import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableCheckboxListItemComponent } from './editable-checkbox-list-item.component';

describe('EditableCheckboxItemComponent', () => {
  let component: EditableCheckboxListItemComponent;
  let fixture: ComponentFixture<EditableCheckboxListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableCheckboxListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableCheckboxListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
