import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableCheckboxItemComponent } from './editable-checkbox-item.component';

describe('EditableCheckboxItemComponent', () => {
  let component: EditableCheckboxItemComponent;
  let fixture: ComponentFixture<EditableCheckboxItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableCheckboxItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableCheckboxItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
