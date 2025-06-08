import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { Subject, of, Observable } from 'rxjs';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../model/customer.model';

export interface SearchResult {
  type: 'customer' | 'account';
  id: string | number;
  title: string;
  subtitle: string;
  route: string[];
}

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="global-search" [class.active]="isActive">
      <div class="search-input-container">
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input
          type="text"
          [formControl]="searchControl"
          placeholder="Rechercher clients, comptes..."
          class="search-input"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown.escape)="clearSearch()"
        />
        <button
          *ngIf="searchControl.value"
          class="search-clear"
          (click)="clearSearch()"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <!-- Résultats de recherche -->
      <div
        *ngIf="
          isActive && (results.length > 0 || isLoading || searchControl.value)
        "
        class="search-results"
      >
        <!-- Indicateur de chargement -->
        <div *ngIf="isLoading" class="search-loading">
          <div class="loading-spinner"></div>
          <span>Recherche en cours...</span>
        </div>

        <!-- Résultats -->
        <div *ngIf="!isLoading && results.length > 0" class="results-list">
          <div
            *ngFor="let result of results; trackBy: trackByResult"
            class="result-item"
            (click)="selectResult(result)"
          >
            <div class="result-icon">
              <svg
                *ngIf="result.type === 'customer'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <svg
                *ngIf="result.type === 'account'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path d="M8 1v6h8V1" />
              </svg>
            </div>
            <div class="result-content">
              <div class="result-title">{{ result.title }}</div>
              <div class="result-subtitle">{{ result.subtitle }}</div>
            </div>
            <div class="result-type">
              {{ result.type === 'customer' ? 'Client' : 'Compte' }}
            </div>
          </div>
        </div>

        <!-- Aucun résultat -->
        <div
          *ngIf="!isLoading && results.length === 0 && searchControl.value"
          class="no-results"
        >
          <div class="no-results-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <div class="no-results-text">
            <div>Aucun résultat trouvé</div>
            <div class="no-results-subtitle">
              Essayez avec d'autres mots-clés
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div
          *ngIf="!isLoading && results.length === 0 && !searchControl.value"
          class="search-suggestions"
        >
          <div class="suggestions-title">Suggestions</div>
          <div class="suggestion-item" (click)="searchSuggestion('clients')">
            Rechercher tous les clients
          </div>
          <div class="suggestion-item" (click)="searchSuggestion('comptes')">
            Rechercher des comptes
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .global-search {
        position: relative;
        width: 100%;
        max-width: 400px;
      }

      .search-input-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: var(--spacing-md);
        color: var(--text-muted);
        z-index: 1;
      }

      .search-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 3rem;
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: var(--font-size-sm);
        transition: all var(--transition-fast);
      }

      .search-input:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
      }

      .search-clear {
        position: absolute;
        right: var(--spacing-sm);
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
      }

      .search-clear:hover {
        color: var(--text-primary);
        background-color: var(--bg-hover);
      }

      .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--bg-card);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        margin-top: var(--spacing-xs);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
      }

      .search-loading {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        color: var(--text-secondary);
      }

      .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid var(--border-primary);
        border-top: 2px solid var(--primary-500);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .results-list {
        padding: var(--spacing-sm);
      }

      .result-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .result-item:hover {
        background-color: var(--bg-hover);
      }

      .result-icon {
        color: var(--primary-500);
        flex-shrink: 0;
      }

      .result-content {
        flex: 1;
      }

      .result-title {
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 2px;
      }

      .result-subtitle {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
      }

      .result-type {
        font-size: var(--font-size-xs);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .no-results {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        color: var(--text-muted);
      }

      .no-results-text {
        flex: 1;
      }

      .no-results-subtitle {
        font-size: var(--font-size-sm);
        margin-top: 2px;
      }

      .search-suggestions {
        padding: var(--spacing-md);
      }

      .suggestions-title {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-sm);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .suggestion-item {
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
      }

      .suggestion-item:hover {
        background-color: var(--bg-hover);
        color: var(--text-primary);
      }
    `,
  ],
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  results: SearchResult[] = [];
  isLoading = false;
  isActive = false;
  private destroy$ = new Subject<void>();

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.performSearch(query || '')),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        this.results = results;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFocus(): void {
    this.isActive = true;
  }

  onBlur(): void {
    // Délai pour permettre le clic sur les résultats
    setTimeout(() => {
      this.isActive = false;
    }, 200);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.results = [];
    this.isActive = false;
  }

  selectResult(result: SearchResult): void {
    this.router.navigate(result.route);
    this.clearSearch();
  }

  searchSuggestion(type: string): void {
    if (type === 'clients') {
      this.router.navigate(['/customers']);
    } else if (type === 'comptes') {
      this.router.navigate(['/accounts']);
    }
    this.clearSearch();
  }

  trackByResult(index: number, result: SearchResult): string {
    return `${result.type}-${result.id}`;
  }

  private performSearch(query: string): Observable<SearchResult[]> {
    if (!query.trim()) {
      return of([]);
    }

    this.isLoading = true;

    // Recherche dans les clients
    return this.customerService.findCustomers(query).pipe(
      switchMap((customers) => {
        const customerResults: SearchResult[] = customers.map((customer) => ({
          type: 'customer' as const,
          id: customer.id,
          title: customer.name,
          subtitle: customer.email,
          route: ['/customers', customer.id.toString()],
        }));

        // Ici on pourrait ajouter la recherche dans les comptes
        // Pour l'instant, on simule quelques comptes
        const accountResults: SearchResult[] = [];
        if (
          query.toLowerCase().includes('acc') ||
          query.toLowerCase().includes('compte')
        ) {
          accountResults.push({
            type: 'account' as const,
            id: 'ACC001',
            title: 'Compte ACC001',
            subtitle: 'Compte courant - Solde: 2,500.75 €',
            route: ['/accounts'],
          });
        }

        return of([...customerResults, ...accountResults]);
      })
    );
  }
}
