import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxListItemComponent } from './checkbox-list-item.component';

describe('CheckboxListItemComponent', () => {
  let component: CheckboxListItemComponent;
  let fixture: ComponentFixture<CheckboxListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
