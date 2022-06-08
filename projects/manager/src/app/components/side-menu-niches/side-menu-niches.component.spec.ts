import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuNichesComponent } from './side-menu-niches.component';

describe('SideMenuNichesComponent', () => {
  let component: SideMenuNichesComponent;
  let fixture: ComponentFixture<SideMenuNichesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuNichesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuNichesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
