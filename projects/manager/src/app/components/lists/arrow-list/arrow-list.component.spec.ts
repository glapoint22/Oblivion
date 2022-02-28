import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowListComponent } from './arrow-list.component';

describe('ArrowListComponent', () => {
  let component: ArrowListComponent;
  let fixture: ComponentFixture<ArrowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
