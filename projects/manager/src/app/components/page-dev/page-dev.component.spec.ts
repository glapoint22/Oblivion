import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDevComponent } from './page-dev.component';

describe('PageDevComponent', () => {
  let component: PageDevComponent;
  let fixture: ComponentFixture<PageDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
