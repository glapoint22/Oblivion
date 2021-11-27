import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsSideMenuComponent } from './lists-side-menu.component';

describe('ListsSideMenuComponent', () => {
  let component: ListsSideMenuComponent;
  let fixture: ComponentFixture<ListsSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListsSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
