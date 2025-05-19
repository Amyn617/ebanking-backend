import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersAccountsComponent } from './customers-accounts.component';

describe('CustomersAccountsComponent', () => {
  let component: CustomersAccountsComponent;
  let fixture: ComponentFixture<CustomersAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomersAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
