import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnPropertiesComponent } from './column-properties.component';

describe('ColumnPropertiesComponent', () => {
  let component: ColumnPropertiesComponent;
  let fixture: ComponentFixture<ColumnPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
