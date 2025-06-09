import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AccountDetails } from '../model/account.model';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../shared/services/toast.service';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';
import { InputComponent } from '../shared/components/input/input.component';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    ButtonComponent,
    CardComponent,
    InputComponent,
    AlertComponent,
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <div class="breadcrumb">
            <a routerLink="/customers" class="breadcrumb-link">Clients</a>
            <span class="breadcrumb-separator">/</span>
            <a routerLink="/accounts" class="breadcrumb-link">Comptes</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Gestion du compte</span>
          </div>
          <h1 class="text-3xl font-bold">Gestion du compte</h1>
          <p class="text-secondary">Détails, historique et opérations</p>
        </div>
        <div class="header-actions" *ngIf="isAdmin">
          <app-button variant="primary" routerLink="/operations">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2v20M2 12h20" />
            </svg>
            Nouvelle opération
          </app-button>
        </div>
      </div>

      <!-- Recherche de compte -->
      <app-card *ngIf="!accountDetails">
        <div slot="header">
          <h2 class="text-xl font-semibold">Rechercher un compte</h2>
        </div>

        <form
          [formGroup]="searchForm"
          (ngSubmit)="searchAccount()"
          class="search-form"
        >
          <div class="form-grid">
            <app-input
              label="ID du compte"
              type="text"
              placeholder="Entrez l'ID du compte à rechercher"
              formControlName="accountId"
              [required]="true"
            ></app-input>
            <app-button type="submit" variant="primary" [loading]="isLoading">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              Rechercher
            </app-button>
          </div>
        </form>
      </app-card>

      <!-- Message d'erreur -->
      <app-alert
        *ngIf="errorMessage"
        type="error"
        [message]="errorMessage"
        [dismissible]="true"
        (dismissed)="clearError()"
      ></app-alert>

      <!-- Détails du compte -->
      <div *ngIf="accountDetails" class="account-details">
        <!-- En-tête du compte -->
        <app-card class="account-header">
          <div class="account-info">
            <div class="account-main">
              <div class="account-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path d="M8 1v6h8V1" />
                </svg>
              </div>
              <div class="account-details-text">
                <h2 class="account-id">{{ accountDetails.accountId }}</h2>
                <p class="account-type">
                  {{ getAccountTypeLabel() }}
                </p>
                <span class="badge" [class]="getAccountStatusBadge()">
                  {{ getAccountStatusLabel() }}
                </span>
              </div>
            </div>
            <div class="account-balance">
              <span class="balance-label">Solde actuel</span>
              <span
                class="balance-amount"
                [class]="getBalanceClass(accountDetails.balance)"
              >
                {{
                  accountDetails.balance
                    | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
                }}
              </span>
            </div>
          </div>

          <div class="account-actions">
            <app-button variant="outline" (click)="refreshAccount()">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualiser
            </app-button>
            <app-button variant="secondary" (click)="searchNewAccount()">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              Autre compte
            </app-button>
          </div>
        </app-card>

        <!-- Statistiques rapides -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon text-primary-500">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{
                accountDetails.accountOperations.length || 0
              }}</span>
              <span class="stat-label">Opérations</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon text-success">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                />
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ getCreditCount() }}</span>
              <span class="stat-label">Crédits</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon text-error">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                />
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ getDebitCount() }}</span>
              <span class="stat-label">Débits</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon text-info">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ getAccountAge() }}</span>
              <span class="stat-label">Jours d'activité</span>
            </div>
          </div>
        </div>

        <!-- Historique des opérations -->
        <app-card>
          <div slot="header">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Historique des opérations</h3>
              <div class="flex gap-2">
                <app-button
                  variant="outline"
                  size="sm"
                  (click)="exportOperations()"
                  *ngIf="isAdmin"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 16l4-4h-3V4h-2v8H8l4 4zM20 18H4v2h16v-2z" />
                  </svg>
                  Exporter
                </app-button>
                <app-button
                  variant="outline"
                  size="sm"
                  (click)="filterOperations()"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filtrer
                </app-button>
              </div>
            </div>
          </div>

          <div class="operations-table">
            <table
              class="table"
              *ngIf="
                accountDetails.accountOperations &&
                accountDetails.accountOperations.length > 0
              "
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Solde après</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="
                    let operation of accountDetails.accountOperations;
                    let i = index
                  "
                >
                  <td>
                    {{
                      operation.operationDate | date : 'dd/MM/yyyy HH:mm' : 'fr'
                    }}
                  </td>
                  <td>
                    <span
                      class="badge"
                      [class]="getOperationTypeBadge(operation.type)"
                    >
                      {{ getOperationTypeLabel(operation.type) }}
                    </span>
                  </td>
                  <td>{{ operation.description }}</td>
                  <td [class]="getOperationAmountClass(operation.amount)">
                    {{
                      operation.amount
                        | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
                    }}
                  </td>
                  <td [class]="getBalanceClass(getBalanceAfterOperation(i))">
                    {{
                      getBalanceAfterOperation(i)
                        | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
                    }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Message si aucune opération -->
            <div
              *ngIf="
                !accountDetails.accountOperations ||
                accountDetails.accountOperations.length === 0
              "
              class="empty-state"
            >
              <div class="empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                  />
                </svg>
              </div>
              <h3>Aucune opération</h3>
              <p class="text-secondary">
                Ce compte n'a pas encore d'opérations
              </p>
              <app-button
                *ngIf="isAdmin"
                variant="primary"
                routerLink="/operations"
              >
                Créer une opération
              </app-button>
            </div>
          </div>

          <!-- Pagination -->
          <div
            *ngIf="accountDetails.totalPage > 1"
            class="pagination-container"
          >
            <div class="pagination">
              <app-button
                variant="outline"
                size="sm"
                [disabled]="accountDetails.currentPage === 0"
                (click)="goToPage(0)"
              >
                Premier
              </app-button>

              <app-button
                variant="outline"
                size="sm"
                [disabled]="accountDetails.currentPage === 0"
                (click)="goToPage(accountDetails.currentPage - 1)"
              >
                Précédent
              </app-button>

              <span class="pagination-info">
                Page {{ accountDetails.currentPage + 1 }} sur
                {{ accountDetails.totalPage }}
              </span>

              <app-button
                variant="outline"
                size="sm"
                [disabled]="
                  accountDetails.currentPage >= accountDetails.totalPage - 1
                "
                (click)="goToPage(accountDetails.currentPage + 1)"
              >
                Suivant
              </app-button>

              <app-button
                variant="outline"
                size="sm"
                [disabled]="
                  accountDetails.currentPage >= accountDetails.totalPage - 1
                "
                (click)="goToPage(accountDetails.totalPage - 1)"
              >
                Dernier
              </app-button>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [
    `
      .account-details {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .account-header .account-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--spacing-md);
      }

      .account-main {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .account-icon {
        width: 64px;
        height: 64px;
        background-color: var(--primary-500);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .account-details-text {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .account-id {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }

      .account-type {
        color: var(--text-secondary);
        margin: 0;
      }

      .account-balance {
        text-align: right;
      }

      .balance-label {
        display: block;
        font-size: var(--font-size-sm);
        color: var(--text-muted);
        margin-bottom: var(--spacing-xs);
      }

      .balance-amount {
        font-size: var(--font-size-2xl);
        font-weight: 700;
      }

      .account-actions {
        display: flex;
        gap: var(--spacing-sm);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
      }

      .stat-card {
        background-color: var(--bg-card);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-secondary);
      }

      .stat-content {
        display: flex;
        flex-direction: column;
      }

      .stat-value {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--text-primary);
      }

      .stat-label {
        font-size: var(--font-size-sm);
        color: var(--text-muted);
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        margin-bottom: var(--spacing-sm);
        font-size: var(--font-size-sm);
      }

      .breadcrumb-link {
        color: var(--primary-500);
        text-decoration: none;
      }

      .breadcrumb-link:hover {
        text-decoration: underline;
      }

      .breadcrumb-separator {
        color: var(--text-muted);
      }

      .breadcrumb-current {
        color: var(--text-secondary);
      }

      .header-content {
        flex: 1;
      }

      .header-actions {
        display: flex;
        gap: var(--spacing-sm);
      }

      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: var(--spacing-xl);
      }

      .search-form .form-grid {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--spacing-md);
        align-items: end;
      }

      .operations-table {
        overflow-x: auto;
      }

      .pagination-container {
        margin-top: var(--spacing-lg);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--border-primary);
      }

      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
      }

      .pagination-info {
        margin: 0 var(--spacing-md);
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .account-info {
          flex-direction: column;
          align-items: flex-start !important;
          gap: var(--spacing-md);
        }

        .account-balance {
          text-align: left;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .search-form .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AccountManagementComponent implements OnInit {
  accountDetails?: AccountDetails;
  searchForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isAdmin = false;
  currentAccountId = '';
  currentPage = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      accountId: [''],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    // Vérifier si un ID de compte est passé en paramètre
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.searchForm.patchValue({ accountId: params['id'] });
        this.searchAccount();
      }
    });
  }

  searchAccount(): void {
    const accountId = this.searchForm.get('accountId')?.value;
    if (!accountId) {
      this.toastService.warning(
        'Veuillez saisir un ID de compte',
        'Champ requis'
      );
      return;
    }

    this.currentAccountId = accountId;
    this.loadAccount(accountId, 0);
  }

  private loadAccount(accountId: string, page: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.accountService.getAccount(accountId, page).subscribe({
      next: (data) => {
        this.accountDetails = data;
        this.currentPage = page;
        this.isLoading = false;
        this.toastService.success('Compte chargé avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Error loading account:', err);
        this.errorMessage =
          "Impossible de charger les détails du compte. Vérifiez l'ID saisi.";
        this.isLoading = false;
        this.toastService.error(
          'Erreur lors du chargement du compte',
          'Erreur'
        );
      },
    });
  }

  refreshAccount(): void {
    if (this.currentAccountId) {
      this.toastService.info('Actualisation en cours...', 'Actualisation');
      this.loadAccount(this.currentAccountId, this.currentPage);
    }
  }

  searchNewAccount(): void {
    this.accountDetails = undefined;
    this.searchForm.reset();
    this.errorMessage = '';
    this.currentAccountId = '';
    this.currentPage = 0;
  }

  goToPage(page: number): void {
    if (this.currentAccountId && page >= 0) {
      this.loadAccount(this.currentAccountId, page);
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }

  // Méthodes utilitaires
  getAccountTypeLabel(): string {
    // Simulation du type de compte basé sur l'ID
    if (!this.accountDetails) return 'Type inconnu';
    const accountId = this.accountDetails.accountId;
    if (accountId.includes('SAV') || accountId.includes('EPARGNE')) {
      return 'Compte épargne';
    }
    return 'Compte courant';
  }

  getAccountStatusLabel(): string {
    // Simulation du statut - tous les comptes sont considérés comme actifs
    return 'Actif';
  }

  getAccountStatusBadge(): string {
    // Simulation du badge - tous les comptes sont considérés comme actifs
    return 'badge-success';
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'text-success';
    if (balance < 0) return 'text-error';
    return 'text-secondary';
  }

  getOperationAmountClass(amount: number): string {
    if (amount > 0) return 'text-success font-medium';
    if (amount < 0) return 'text-error font-medium';
    return 'text-secondary';
  }

  getOperationTypeBadge(type: string): string {
    switch (type?.toUpperCase()) {
      case 'CREDIT':
        return 'badge-success';
      case 'DEBIT':
        return 'badge-error';
      case 'TRANSFER':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  getOperationTypeLabel(type: string): string {
    switch (type?.toUpperCase()) {
      case 'CREDIT':
        return 'Crédit';
      case 'DEBIT':
        return 'Débit';
      case 'TRANSFER':
        return 'Transfert';
      default:
        return type || 'Inconnu';
    }
  }

  getCreditCount(): number {
    return (
      this.accountDetails?.accountOperations?.filter(
        (op) => op.type?.toUpperCase() === 'CREDIT'
      ).length || 0
    );
  }

  getDebitCount(): number {
    return (
      this.accountDetails?.accountOperations?.filter(
        (op) => op.type?.toUpperCase() === 'DEBIT'
      ).length || 0
    );
  }

  getAccountAge(): number {
    // Simulation de l'âge du compte - génération aléatoire entre 30 et 365 jours
    if (!this.accountDetails) return 0;
    return Math.floor(Math.random() * 335) + 30;
  }

  getBalanceAfterOperation(index: number): number {
    if (!this.accountDetails?.accountOperations) return 0;

    // Calculer le solde après cette opération
    let balance = this.accountDetails.balance;
    const operations = this.accountDetails.accountOperations.slice(
      0,
      index + 1
    );

    // Soustraire toutes les opérations suivantes pour obtenir le solde à ce moment
    for (
      let i = index + 1;
      i < this.accountDetails.accountOperations.length;
      i++
    ) {
      const op = this.accountDetails.accountOperations[i];
      balance -= op.amount;
    }

    return balance;
  }

  exportOperations(): void {
    this.toastService.info(
      "Fonctionnalité d'export en cours de développement",
      'Export'
    );
  }

  filterOperations(): void {
    this.toastService.info(
      'Fonctionnalité de filtrage en cours de développement',
      'Filtres'
    );
  }
}
