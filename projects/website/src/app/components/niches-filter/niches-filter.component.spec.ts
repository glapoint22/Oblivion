import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NichesFilterComponent } from './niches-filter.component';

describe('NichesFilterComponent', () => {
  let component: NichesFilterComponent;
  let fixture: ComponentFixture<NichesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NichesFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NichesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
