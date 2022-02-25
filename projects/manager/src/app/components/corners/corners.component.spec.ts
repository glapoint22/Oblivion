import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CornersComponent } from './corners.component';

describe('CornersComponent', () => {
  let component: CornersComponent;
  let fixture: ComponentFixture<CornersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CornersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CornersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
