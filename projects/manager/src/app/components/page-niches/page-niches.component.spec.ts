import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNichesComponent } from './page-niches.component';

describe('PageNichesComponent', () => {
  let component: PageNichesComponent;
  let fixture: ComponentFixture<PageNichesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageNichesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNichesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
