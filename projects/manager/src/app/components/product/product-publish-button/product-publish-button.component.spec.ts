import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPublishButtonComponent } from './product-publish-button.component';

describe('ProductPublishButtonComponent', () => {
  let component: ProductPublishButtonComponent;
  let fixture: ComponentFixture<ProductPublishButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPublishButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPublishButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
