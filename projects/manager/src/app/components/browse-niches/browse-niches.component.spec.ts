import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseNichesComponent } from './browse-niches.component';

describe('BrowseNichesComponent', () => {
  let component: BrowseNichesComponent;
  let fixture: ComponentFixture<BrowseNichesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseNichesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseNichesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
