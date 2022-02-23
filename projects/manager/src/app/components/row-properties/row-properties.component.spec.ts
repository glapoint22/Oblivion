import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowPropertiesComponent } from './row-properties.component';

describe('RowPropertiesComponent', () => {
  let component: RowPropertiesComponent;
  let fixture: ComponentFixture<RowPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
