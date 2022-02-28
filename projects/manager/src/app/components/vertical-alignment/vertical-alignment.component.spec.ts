import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalAlignmentComponent } from './vertical-alignment.component';

describe('VerticalAlignmentComponent', () => {
  let component: VerticalAlignmentComponent;
  let fixture: ComponentFixture<VerticalAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
