import {
  AsyncPipe,
  NgFor,
  NgIf,
  CommonModule,
  CurrencyPipe,
  DatePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountDetails } from '../model/account.model';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';
import { InputComponent } from '../shared/components/input/input.component';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  imports: [
    CommonModule,
    NgFor,
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ButtonComponent,
    CardComponent,
    InputComponent,
    AlertComponent,
  ],
})
export class AccountsComponent implements OnInit {
  accounts?: Observable<AccountDetails>;
  errorMessage?: string;
  isLoading: boolean = false;
  searchFormGroup?: FormGroup;
  private currentAccountId: string = '';
  private currentPage: number = 0;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  findAccount(accountId: string, page: number = 0) {
    this.currentAccountId = accountId;
    this.currentPage = page;
    this.errorMessage = '';
    this.isLoading = true;
    this.accounts = undefined;

    this.accountService.getAccount(accountId, page).subscribe({
      next: (data: AccountDetails) => {
        this.accounts = of(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Could not load account details.';
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number) {
    if (page >= 0) {
      this.findAccount(this.currentAccountId, page);
    }
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      accountId: this.fb.control(''),
    });

    this.isAdmin = this.authService.isAdmin();
  }

  clearError(): void {
    this.errorMessage = '';
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
        return 'badge-info';
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

  getPageNumbers(totalPages: number): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
