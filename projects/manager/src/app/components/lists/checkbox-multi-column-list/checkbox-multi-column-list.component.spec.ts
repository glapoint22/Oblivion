import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxMultiColumnListComponent } from './checkbox-multi-column-list.component';

describe('CheckboxMultiColumnListComponent', () => {
  let component: CheckboxMultiColumnListComponent;
  let fixture: ComponentFixture<CheckboxMultiColumnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxMultiColumnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxMultiColumnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
