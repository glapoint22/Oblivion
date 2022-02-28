import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableArrowListComponent } from './editable-arrow-list.component';

describe('EditableArrowListComponent', () => {
  let component: EditableArrowListComponent;
  let fixture: ComponentFixture<EditableArrowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableArrowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableArrowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
