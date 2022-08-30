import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailButtonWidgetPropertiesComponent } from './email-button-widget-properties.component';

describe('EmailButtonWidgetPropertiesComponent', () => {
  let component: EmailButtonWidgetPropertiesComponent;
  let fixture: ComponentFixture<EmailButtonWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailButtonWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailButtonWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
