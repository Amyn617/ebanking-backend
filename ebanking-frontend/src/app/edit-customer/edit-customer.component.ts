import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-customer',
  standalone: false,
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css',
})
export class EditCustomerComponent implements OnInit {
  editCustomerFormGroup!: FormGroup;
  customerId!: number;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];

    this.editCustomerFormGroup = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control(''),
      address: this.fb.control(''),
      status: this.fb.control('ACTIVE'),
    });

    this.loadCustomer();
  }

  loadCustomer() {
    this.isLoading = true;
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer) => {
        this.editCustomerFormGroup.patchValue({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || '',
          status: customer.status || 'ACTIVE',
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading customer data. Please try again.';
        console.error(err);
      },
    });
  }

  handleUpdateCustomer() {
    if (this.editCustomerFormGroup.invalid) {
      return;
    }

    this.isLoading = true;
    const customerData: Customer = {
      ...this.editCustomerFormGroup.value,
      id: this.customerId,
    };

    this.customerService
      .updateCustomer(this.customerId, customerData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          alert('Customer updated successfully!');
          this.router.navigateByUrl('/customers');
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update customer. Please try again.';
          console.error(err);
        },
      });
  }

  cancelEdit() {
    this.router.navigateByUrl('/customers');
  }
}
