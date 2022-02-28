import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableArrowItemComponent } from './editable-arrow-item.component';

describe('EditableArrowItemComponent', () => {
  let component: EditableArrowItemComponent;
  let fixture: ComponentFixture<EditableArrowItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableArrowItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableArrowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
