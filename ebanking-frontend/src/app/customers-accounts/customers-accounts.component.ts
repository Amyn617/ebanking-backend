import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../model/customer.model';
import { CustomerService } from '../services/customer.service';

interface Account {
  id: string;
  balance: number;
  creationDate: Date;
  type: string;
  status: string;
  customerId: string;
}

@Component({
  selector: 'app-customers-accounts',
  standalone: false,
  templateUrl: './customers-accounts.component.html',
  styleUrl: './customers-accounts.component.css',
})
export class CustomersAccountsComponent implements OnInit {
  customerId: string = '';
  customer: Customer | null = null;
  accounts: Account[] = [];

  // Account statistics
  accountsCount: number = 0;
  activeAccountsCount: number = 0;
  pendingAccountsCount: number = 0;
  totalBalance: number = 0;
  lastTransactionAmount: number = 580.5;
  lastTransactionDate: Date = new Date();
  positiveTrend: string = '+15%';

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];

    // Load customer data if ID is available
    if (this.customerId) {
      this.loadCustomer();
      this.loadAccounts();
    }
  }

  loadCustomer(): void {
    // Convert string customerId to number before passing to the service
    const customerIdNumber = parseInt(this.customerId, 10);

    this.customerService.getCustomerById(customerIdNumber).subscribe({
      next: (data) => {
        this.customer = data;
      },
      error: (err) => {
        console.error('Error loading customer:', err);
        // Fallback to a dummy customer for demonstration
        this.customer = {
          id: customerIdNumber,
          name: 'Sample Customer',
          email: 'sample@example.com',
          status: 'ACTIVE',
        };
      },
    });
  }

  loadAccounts(): void {
    // For demonstration, we'll create dummy accounts
    this.accounts = [
      {
        id: 'ACC-001',
        balance: 5325.75,
        creationDate: new Date(2023, 2, 15),
        type: 'CURRENT',
        status: 'ACTIVE',
        customerId: this.customerId,
      },
      {
        id: 'ACC-002',
        balance: 12750.5,
        creationDate: new Date(2023, 4, 20),
        type: 'SAVINGS',
        status: 'ACTIVE',
        customerId: this.customerId,
      },
      {
        id: 'ACC-003',
        balance: 500.0,
        creationDate: new Date(2023, 6, 10),
        type: 'CURRENT',
        status: 'PENDING',
        customerId: this.customerId,
      },
    ];

    // Calculate statistics
    this.accountsCount = this.accounts.length;
    this.activeAccountsCount = this.accounts.filter(
      (account) => account.status === 'ACTIVE'
    ).length;
    this.pendingAccountsCount = this.accounts.filter(
      (account) => account.status === 'PENDING'
    ).length;
    this.totalBalance = this.accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );
  }

  getInitials(name: string): string {
    if (!name) return '?';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return name.charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  }

  getStatusBadgeClass(customer: Customer | null) {
    if (!customer) return 'badge-active';

    switch (customer.status) {
      case 'ACTIVE':
        return 'badge-active';
      case 'INACTIVE':
        return 'badge-inactive';
      case 'PENDING':
        return 'badge-pending';
      default:
        return 'badge-active'; // Default to active
    }
  }

  getAccountBadgeClass(account: Account) {
    switch (account.status) {
      case 'ACTIVE':
        return 'badge-active';
      case 'INACTIVE':
        return 'badge-inactive';
      case 'PENDING':
        return 'badge-pending';
      case 'SUSPENDED':
        return 'badge-inactive';
      default:
        return 'badge-active'; // Default to active
    }
  }
}
