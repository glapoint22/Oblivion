import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRowPropertiesComponent } from './page-row-properties.component';

describe('RowPropertiesComponent', () => {
  let component: PageRowPropertiesComponent;
  let fixture: ComponentFixture<PageRowPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRowPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRowPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
