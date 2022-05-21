import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxMultiColumnItemComponent } from './checkbox-multi-column-item.component';

describe('CheckboxMultiColumnItemComponent', () => {
  let component: CheckboxMultiColumnItemComponent;
  let fixture: ComponentFixture<CheckboxMultiColumnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxMultiColumnItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxMultiColumnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
