import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../shared/components/card/card.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { AlertComponent } from '../shared/components/alert/alert.component';
import {
  StatsChartComponent,
  ChartData,
} from '../shared/components/stats-chart/stats-chart.component';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { AccountService } from '../services/account.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    AlertComponent,
    StatsChartComponent,
  ],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <h1 class="text-3xl font-bold mb-4">Tableau de bord</h1>
        <p class="text-secondary mb-8">
          Bienvenue dans votre espace de gestion bancaire
        </p>
      </div>

      <!-- Statistiques rapides -->
      <div class="stats-grid">
        <app-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon customers">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ totalCustomers }}</h3>
              <p class="stat-label">Clients</p>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon accounts">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path d="M8 1v6h8V1" />
              </svg>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ totalAccounts }}</h3>
              <p class="stat-label">Comptes</p>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon operations">
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
            <div class="stat-info">
              <h3 class="stat-number">{{ totalOperations }}</h3>
              <p class="stat-label">Opérations</p>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Message d'information pour les utilisateurs -->
      <app-alert
        *ngIf="!isAdmin"
        type="info"
        title="Compte utilisateur"
        message="Vous avez un accès en lecture seule. Contactez un administrateur pour effectuer des modifications."
      ></app-alert>

      <!-- Actions rapides -->
      <div class="quick-actions">
        <h2 class="text-2xl font-semibold mb-6">Actions rapides</h2>

        <div class="actions-grid">
          <app-card class="action-card" [hover]="true">
            <div class="action-content">
              <div class="action-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 class="action-title">
                {{ isAdmin ? 'Gestion des clients' : 'Consulter les clients' }}
              </h3>
              <p class="action-description">
                {{
                  isAdmin
                    ? 'Consulter, ajouter et modifier les informations clients'
                    : 'Consulter les informations des clients'
                }}
              </p>
              <app-button
                variant="primary"
                [fullWidth]="true"
                routerLink="/customers"
              >
                {{ isAdmin ? 'Gérer les clients' : 'Voir les clients' }}
              </app-button>
            </div>
          </app-card>

          <app-card class="action-card" [hover]="true">
            <div class="action-content">
              <div class="action-icon">
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
              <h3 class="action-title">
                {{ isAdmin ? 'Gestion des comptes' : 'Consulter les comptes' }}
              </h3>
              <p class="action-description">
                {{
                  isAdmin
                    ? 'Consulter les comptes et gérer les opérations'
                    : 'Consulter les comptes et leurs opérations'
                }}
              </p>
              <app-button
                variant="primary"
                [fullWidth]="true"
                routerLink="/accounts"
              >
                {{ isAdmin ? 'Gérer les comptes' : 'Voir les comptes' }}
              </app-button>
            </div>
          </app-card>

          <app-card class="action-card" [hover]="true" *ngIf="isAdmin">
            <div class="action-content">
              <div class="action-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                  />
                </svg>
              </div>
              <h3 class="action-title">Opérations bancaires</h3>
              <p class="action-description">
                Effectuer des crédits, débits et transferts
              </p>
              <app-button
                variant="primary"
                [fullWidth]="true"
                routerLink="/operations"
              >
                Gérer les opérations
              </app-button>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Graphiques et statistiques avancées -->
      <div class="charts-section" *ngIf="isAdmin">
        <h2 class="text-2xl font-semibold mb-6">Statistiques détaillées</h2>

        <div class="charts-grid">
          <!-- Graphique des opérations -->
          <app-stats-chart
            type="donut"
            title="Répartition des opérations"
            subtitle="Types d'opérations ce mois"
            [data]="operationsChartData"
            valueFormat="number"
          ></app-stats-chart>

          <!-- Graphique des comptes -->
          <app-stats-chart
            type="bar"
            title="Types de comptes"
            subtitle="Répartition par type"
            [data]="accountsChartData"
            valueFormat="number"
          ></app-stats-chart>

          <!-- Évolution mensuelle -->
          <app-stats-chart
            type="line"
            title="Évolution mensuelle"
            subtitle="Nombre d'opérations par mois"
            [data]="monthlyStatsData"
            valueFormat="number"
          ></app-stats-chart>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-header {
        text-align: center;
        margin-bottom: var(--spacing-2xl);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-2xl);
      }

      .stat-card {
        background: linear-gradient(
          135deg,
          var(--bg-card) 0%,
          var(--bg-secondary) 100%
        );
      }

      .stat-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .stat-icon.customers {
        background: linear-gradient(
          135deg,
          var(--primary-500),
          var(--primary-600)
        );
      }

      .stat-icon.accounts {
        background: linear-gradient(135deg, var(--success), #059669);
      }

      .stat-icon.operations {
        background: linear-gradient(135deg, var(--warning), #d97706);
      }

      .stat-number {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }

      .stat-label {
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
        margin: 0;
      }

      .quick-actions {
        margin-top: var(--spacing-2xl);
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
      }

      .action-content {
        text-align: center;
      }

      .action-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto var(--spacing-md);
        background: linear-gradient(
          135deg,
          var(--primary-500),
          var(--primary-600)
        );
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .action-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary);
      }

      .action-description {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
        line-height: 1.5;
      }

      .charts-section {
        margin-top: var(--spacing-2xl);
        padding-top: var(--spacing-2xl);
        border-top: 1px solid var(--border-primary);
      }

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: var(--spacing-xl);
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .actions-grid {
          grid-template-columns: 1fr;
        }

        .charts-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  totalCustomers = 0;
  totalAccounts = 0;
  totalOperations = 0;
  isAdmin = false;

  // Données pour les graphiques
  operationsChartData: ChartData[] = [];
  accountsChartData: ChartData[] = [];
  monthlyStatsData: ChartData[] = [];

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadDashboardData();
    this.generateChartData();

    // Message de bienvenue avec toast
    this.toastService.info(
      `Bienvenue ${this.isAdmin ? 'Administrateur' : 'Utilisateur'} !`,
      'Connexion réussie'
    );
  }

  private loadDashboardData(): void {
    // Charger le nombre de clients
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.toastService.error(
          'Erreur lors du chargement des données',
          'Erreur'
        );
      },
    });

    // Pour les comptes et opérations, nous utiliserons des valeurs simulées
    // car l'API actuelle ne fournit pas d'endpoints pour ces statistiques
    this.totalAccounts = 12; // Valeur simulée
    this.totalOperations = 156; // Valeur simulée
  }

  private generateChartData(): void {
    // Données pour le graphique des opérations
    this.operationsChartData = [
      { label: 'Crédits', value: 89, color: '#10b981' },
      { label: 'Débits', value: 45, color: '#ef4444' },
      { label: 'Transferts', value: 22, color: '#3b82f6' },
    ];

    // Données pour le graphique des types de comptes
    this.accountsChartData = [
      { label: 'Comptes courants', value: 8, color: '#3b82f6' },
      { label: 'Comptes épargne', value: 4, color: '#10b981' },
    ];

    // Données pour les statistiques mensuelles
    this.monthlyStatsData = [
      { label: 'Jan', value: 120 },
      { label: 'Fév', value: 135 },
      { label: 'Mar', value: 98 },
      { label: 'Avr', value: 156 },
      { label: 'Mai', value: 142 },
      { label: 'Jun', value: 178 },
    ];
  }
}
