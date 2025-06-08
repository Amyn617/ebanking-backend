import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { Customer } from '../model/customer.model';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';
import { AlertComponent } from '../shared/components/alert/alert.component';

// Interface pour les comptes simulés
interface MockAccount {
  id: string;
  type: 'current' | 'savings';
  balance: number;
  status: 'active' | 'inactive' | 'blocked';
  createdDate: Date;
}

@Component({
  selector: 'app-customer-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    DatePipe,
    ButtonComponent,
    CardComponent,
    AlertComponent,
  ],
  templateUrl: './customer-account.component.html',
  styleUrl: './customer-account.component.css',
})
export class CustomerAccountComponent implements OnInit {
  customer: Customer | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  isAdmin: boolean = false;
  mockAccounts: MockAccount[] = [];

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.route.params.subscribe((params) => {
      const customerId = params['id'];
      if (customerId) {
        this.loadCustomerData(customerId);
        this.generateMockAccounts(customerId);
      }
    });
  }

  private loadCustomerData(customerId: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getCustomerById(Number(customerId)).subscribe({
      next: (data) => {
        this.customer = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des données du client';
        this.isLoading = false;
        console.error('Erreur:', err);
      },
    });
  }

  private generateMockAccounts(customerId: string): void {
    // Génération de comptes simulés pour la démonstration
    this.mockAccounts = [
      {
        id: `ACC${customerId}001`,
        type: 'current',
        balance: 2500.75,
        status: 'active',
        createdDate: new Date('2023-01-15'),
      },
      {
        id: `ACC${customerId}002`,
        type: 'savings',
        balance: 15000.0,
        status: 'active',
        createdDate: new Date('2023-03-20'),
      },
    ];
  }

  getRegistrationDate(): string {
    // Date simulée d'inscription
    return '15/01/2023';
  }

  getAccountTypeLabel(type: string): string {
    switch (type) {
      case 'current':
        return 'Compte courant';
      case 'savings':
        return 'Compte épargne';
      default:
        return 'Compte';
    }
  }

  getAccountStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'blocked':
        return 'Bloqué';
      default:
        return status;
    }
  }

  getAccountStatusBadge(status: string): string {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-warning';
      case 'blocked':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  }

  getAccountIconClass(type: string): string {
    switch (type) {
      case 'current':
        return 'text-primary-500';
      case 'savings':
        return 'text-success';
      default:
        return 'text-secondary';
    }
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'text-success';
    if (balance < 0) return 'text-error';
    return 'text-secondary';
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
