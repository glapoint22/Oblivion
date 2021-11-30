import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSideMenuComponent } from './orders-side-menu.component';

describe('OrdersSideMenuComponent', () => {
  let component: OrdersSideMenuComponent;
  let fixture: ComponentFixture<OrdersSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
