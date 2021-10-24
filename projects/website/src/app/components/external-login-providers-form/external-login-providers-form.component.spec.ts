import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginProvidersFormComponent } from './external-login-providers-form.component';

describe('ExternalLoginProvidersFormComponent', () => {
  let component: ExternalLoginProvidersFormComponent;
  let fixture: ComponentFixture<ExternalLoginProvidersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginProvidersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginProvidersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
