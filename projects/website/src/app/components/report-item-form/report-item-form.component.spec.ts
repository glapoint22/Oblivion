import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportItemFormComponent } from './report-item-form.component';

describe('ReportItemFormComponent', () => {
  let component: ReportItemFormComponent;
  let fixture: ComponentFixture<ReportItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportItemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
