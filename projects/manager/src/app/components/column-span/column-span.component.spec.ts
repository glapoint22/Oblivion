import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSpanComponent } from './column-span.component';

describe('ColumnSpanComponent', () => {
  let component: ColumnSpanComponent;
  let fixture: ComponentFixture<ColumnSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnSpanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
