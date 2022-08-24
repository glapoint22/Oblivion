import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInspectorComponent } from './page-inspector.component';

describe('PageInspectorComponent', () => {
  let component: PageInspectorComponent;
  let fixture: ComponentFixture<PageInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageInspectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
