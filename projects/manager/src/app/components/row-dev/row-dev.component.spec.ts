import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowDevComponent } from './row-dev.component';

describe('RowDevComponent', () => {
  let component: RowDevComponent;
  let fixture: ComponentFixture<RowDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
