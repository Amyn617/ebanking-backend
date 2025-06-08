import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { AccountOperation } from '../model/account.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';
import { InputComponent } from '../shared/components/input/input.component';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
  selector: 'app-new-operation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    AlertComponent,
  ],
  templateUrl: './new-operation.component.html',
  styleUrls: ['./new-operation.component.css'],
})
export class NewOperationComponent implements OnInit {
  newOperationForm!: FormGroup;
  transferForm!: FormGroup;
  operationTypes = ['CREDIT', 'DEBIT'];
  activeTab: 'simple' | 'transfer' = 'simple';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isTransferLoading = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newOperationForm = this.fb.group({
      accountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      type: ['', Validators.required],
      operationDate: [this.getCurrentDate(), Validators.required],
      description: ['', Validators.required],
    });

    this.transferForm = this.fb.group({
      accountSource: ['', Validators.required],
      accountDestination: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
    });
  }

  setActiveTab(tab: 'simple' | 'transfer'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  handleAddOperation(): void {
    if (this.newOperationForm.invalid) return;

    this.isLoading = true;
    this.clearMessages();

    const formValue = this.newOperationForm.value;
    const operation: AccountOperation = {
      id: 0,
      operationDate: formValue.operationDate,
      amount: parseFloat(formValue.amount),
      type: formValue.type,
      description: formValue.description,
    };

    this.accountService
      .saveOperation(formValue.accountId, operation)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Opération effectuée avec succès !';
          this.resetForm();
        },
        error: (err) => {
          this.isLoading = false;
          console.error("Erreur lors de l'opération:", err);
          this.errorMessage = "Erreur lors de l'opération. Veuillez réessayer.";
        },
      });
  }

  handleTransfer(): void {
    if (this.transferForm.invalid) return;

    this.isTransferLoading = true;
    this.clearMessages();

    const formValue = this.transferForm.value;
    const amount = parseFloat(formValue.amount);

    // Effectuer le débit sur le compte source
    const debitOperation: AccountOperation = {
      id: 0,
      operationDate: this.getCurrentDate(),
      amount: -amount,
      type: 'DEBIT',
      description: `Transfert vers ${formValue.accountDestination}: ${formValue.description}`,
    };

    this.accountService
      .saveOperation(formValue.accountSource, debitOperation)
      .subscribe({
        next: () => {
          // Effectuer le crédit sur le compte destination
          const creditOperation: AccountOperation = {
            id: 0,
            operationDate: this.getCurrentDate(),
            amount: amount,
            type: 'CREDIT',
            description: `Transfert de ${formValue.accountSource}: ${formValue.description}`,
          };

          this.accountService
            .saveOperation(formValue.accountDestination, creditOperation)
            .subscribe({
              next: () => {
                this.isTransferLoading = false;
                this.successMessage = 'Transfert effectué avec succès !';
                this.resetTransferForm();
              },
              error: (err) => {
                this.isTransferLoading = false;
                console.error('Erreur lors du crédit:', err);
                this.errorMessage =
                  'Erreur lors du transfert (crédit). Veuillez contacter le support.';
              },
            });
        },
        error: (err) => {
          this.isTransferLoading = false;
          console.error('Erreur lors du débit:', err);
          this.errorMessage =
            'Erreur lors du transfert (débit). Veuillez réessayer.';
        },
      });
  }

  getFieldError(fieldName: string): string | undefined {
    const field = this.newOperationForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors?.['min']) {
        return 'Le montant doit être supérieur à 0';
      }
    }
    return undefined;
  }

  getTransferFieldError(fieldName: string): string | undefined {
    const field = this.transferForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors?.['min']) {
        return 'Le montant doit être supérieur à 0';
      }
    }
    return undefined;
  }

  resetForm(): void {
    this.newOperationForm.reset({
      operationDate: this.getCurrentDate(),
    });
  }

  resetTransferForm(): void {
    this.transferForm.reset();
  }

  clearError(): void {
    this.errorMessage = '';
  }

  clearSuccess(): void {
    this.successMessage = '';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
