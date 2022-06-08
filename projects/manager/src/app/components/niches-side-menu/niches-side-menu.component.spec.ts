import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NichesSideMenuComponent } from './niches-side-menu.component';

describe('NichesSideMenuComponent', () => {
  let component: NichesSideMenuComponent;
  let fixture: ComponentFixture<NichesSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NichesSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NichesSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
