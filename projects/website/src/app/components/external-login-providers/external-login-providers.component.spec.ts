import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginProvidersComponent } from './external-login-providers.component';

describe('ExternalLoginProvidersComponent', () => {
  let component: ExternalLoginProvidersComponent;
  let fixture: ComponentFixture<ExternalLoginProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
