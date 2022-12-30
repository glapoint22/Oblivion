import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReformListFormComponent } from './reform-list-form.component';

describe('ReformListFormComponent', () => {
  let component: ReformListFormComponent;
  let fixture: ComponentFixture<ReformListFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReformListFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReformListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
