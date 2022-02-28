import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableCheckboxListComponent } from './editable-checkbox-list.component';

describe('EditableCheckboxListComponent', () => {
  let component: EditableCheckboxListComponent;
  let fixture: ComponentFixture<EditableCheckboxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableCheckboxListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableCheckboxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
