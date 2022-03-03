import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowItemComponent } from './arrow-item.component';

describe('ArrowItemComponent', () => {
  let component: ArrowItemComponent;
  let fixture: ComponentFixture<ArrowItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
