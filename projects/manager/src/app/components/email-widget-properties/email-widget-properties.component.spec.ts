import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailWidgetPropertiesComponent } from './email-widget-properties.component';

describe('EmailWidgetPropertiesComponent', () => {
  let component: EmailWidgetPropertiesComponent;
  let fixture: ComponentFixture<EmailWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
