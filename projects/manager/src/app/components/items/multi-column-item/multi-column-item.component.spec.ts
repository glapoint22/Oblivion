import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnItemComponent } from './multi-column-item.component';

describe('MultiColumnItemComponent', () => {
  let component: MultiColumnItemComponent;
  let fixture: ComponentFixture<MultiColumnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiColumnItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiColumnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
