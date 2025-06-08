import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountComponent } from './customer-account.component';

describe('CustomerAccountComponent', () => {
  let component: CustomerAccountComponent;
  let fixture: ComponentFixture<CustomerAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
