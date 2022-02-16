import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDevComponent } from './column-dev.component';

describe('ColumnDevComponent', () => {
  let component: ColumnDevComponent;
  let fixture: ComponentFixture<ColumnDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
