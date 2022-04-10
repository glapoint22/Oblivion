import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnListComponent } from './multi-column-list.component';

describe('MultiColumnListComponent', () => {
  let component: MultiColumnListComponent;
  let fixture: ComponentFixture<MultiColumnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiColumnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiColumnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
