import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageColumnPropertiesComponent } from './page-column-properties.component';

describe('ColumnPropertiesComponent', () => {
  let component: PageColumnPropertiesComponent;
  let fixture: ComponentFixture<PageColumnPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageColumnPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageColumnPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
