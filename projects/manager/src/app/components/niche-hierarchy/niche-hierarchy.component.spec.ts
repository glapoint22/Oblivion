import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NicheHierarchyComponent } from './niche-hierarchy.component';

describe('NicheHierarchyComponent', () => {
  let component: NicheHierarchyComponent;
  let fixture: ComponentFixture<NicheHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NicheHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NicheHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
