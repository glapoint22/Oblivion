import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerDevComponent } from './container-dev.component';

describe('ContainerDevComponent', () => {
  let component: ContainerDevComponent;
  let fixture: ComponentFixture<ContainerDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
