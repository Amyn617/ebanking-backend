import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Customer } from '../../../model/customer.model';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../services/auth.service';

// Interface pour les comptes simulés
interface CustomerAccount {
  id: string;
  type: 'current' | 'savings';
  balance: number;
  status: 'active' | 'inactive' | 'blocked';
  createdDate: Date;
}

@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, ButtonComponent],
  template: `
    <div class="customer-card">
      <div class="customer-header">
        <div class="customer-info">
          <div class="customer-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div class="customer-details">
            <h3 class="customer-name">{{ customer.name }}</h3>
            <p class="customer-email">{{ customer.email }}</p>
            <span class="customer-id">ID: {{ customer.id }}</span>
          </div>
        </div>
        <div class="customer-actions">
          <app-button
            variant="outline"
            size="sm"
            [routerLink]="['/customers', customer.id]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Détails
          </app-button>
          <app-button
            *ngIf="isAdmin"
            variant="error"
            size="sm"
            (click)="onDeleteCustomer()"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
            </svg>
            Supprimer
          </app-button>
        </div>
      </div>

      <div class="customer-accounts">
        <div class="accounts-header">
          <h4>Comptes bancaires</h4>
          <span class="accounts-count">{{ accounts.length }} compte(s)</span>
        </div>

        <div class="accounts-list" *ngIf="accounts.length > 0">
          <div *ngFor="let account of accounts" class="account-item">
            <div class="account-info">
              <div class="account-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" [class]="getAccountIconClass(account.type)">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                  <path d="M8 1v6h8V1"/>
                </svg>
              </div>
              <div class="account-details">
                <span class="account-id">{{ account.id }}</span>
                <span class="account-type">{{ getAccountTypeLabel(account.type) }}</span>
              </div>
            </div>
            <div class="account-balance">
              <span class="balance" [class]="getBalanceClass(account.balance)">
                {{ account.balance | currency:'EUR':'symbol':'1.2-2':'fr' }}
              </span>
              <span class="badge" [class]="getAccountStatusBadge(account.status)">
                {{ getAccountStatusLabel(account.status) }}
              </span>
            </div>
          </div>
        </div>

        <div *ngIf="accounts.length === 0" class="no-accounts">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            <path d="M8 1v6h8V1"/>
          </svg>
          <span>Aucun compte bancaire</span>
        </div>
      </div>

      <div class="customer-stats">
        <div class="stat-item">
          <span class="stat-label">Total des soldes</span>
          <span class="stat-value">{{ getTotalBalance() | currency:'EUR':'symbol':'1.2-2':'fr' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Client depuis</span>
          <span class="stat-value">{{ getRegistrationDate() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      transition: all var(--transition-fast);
    }

    .customer-card:hover {
      border-color: var(--border-secondary);
      box-shadow: var(--shadow-md);
    }

    .customer-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .customer-avatar {
      width: 48px;
      height: 48px;
      background-color: var(--primary-500);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .customer-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .customer-name {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .customer-email {
      color: var(--text-secondary);
      margin: 0;
    }

    .customer-id {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    .customer-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .customer-accounts {
      margin-bottom: var(--spacing-lg);
    }

    .accounts-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
    }

    .accounts-header h4 {
      font-size: var(--font-size-md);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .accounts-count {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    .accounts-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .account-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-primary);
    }

    .account-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .account-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .account-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .account-id {
      font-weight: 500;
      color: var(--text-primary);
      font-size: var(--font-size-sm);
    }

    .account-type {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .account-balance {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--spacing-xs);
    }

    .balance {
      font-weight: 600;
      font-size: var(--font-size-md);
    }

    .no-accounts {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      color: var(--text-muted);
      font-size: var(--font-size-sm);
    }

    .customer-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-primary);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .customer-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .customer-actions {
        width: 100%;
        justify-content: flex-end;
      }

      .customer-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerCardComponent implements OnInit {
  @Input() customer!: Customer;
  @Input() onDelete?: (customer: Customer) => void;

  accounts: CustomerAccount[] = [];
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.generateMockAccounts();
  }

  private generateMockAccounts(): void {
    // Génération de comptes simulés pour la démonstration
    const accountCount = Math.floor(Math.random() * 3) + 1; // 1 à 3 comptes
    this.accounts = [];

    for (let i = 0; i < accountCount; i++) {
      this.accounts.push({
        id: `ACC${this.customer.id}${String(i + 1).padStart(3, '0')}`,
        type: i === 0 ? 'current' : 'savings',
        balance: Math.random() * 10000 + 500,
        status: 'active',
        createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      });
    }
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

  getTotalBalance(): number {
    return this.accounts.reduce((total, account) => total + account.balance, 0);
  }

  getRegistrationDate(): string {
    // Date simulée d'inscription
    const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('fr-FR');
  }

  onDeleteCustomer(): void {
    if (this.onDelete) {
      this.onDelete(this.customer);
    }
  }
}
