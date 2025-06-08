import { CustomerService } from './../services/customer.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Customer } from '../model/customer.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';
import { InputComponent } from '../shared/components/input/input.component';
import { AlertComponent } from '../shared/components/alert/alert.component';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-new-customer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    AlertComponent,
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css',
})
export class NewCustomerComponent implements OnInit {
  newCustomerFormGroup!: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      birthDate: [''],
      address: [''],
      createAccount: [false],
      initialBalance: [0, [Validators.min(0)]],
    });
  }

  handleAddCustomer(): void {
    if (this.newCustomerFormGroup.invalid) return;

    this.isLoading = true;
    this.clearMessages();

    const formValue = this.newCustomerFormGroup.value;
    const customer: Customer = {
      id: 0,
      name: formValue.name,
      email: formValue.email,
    };

    this.customerService.saveCustomer(customer).subscribe({
      next: (data: Customer) => {
        this.isLoading = false;

        // Notification toast de succès
        this.toastService.success(
          `Client "${data.name}" créé avec succès !`,
          'Création réussie'
        );

        this.successMessage = `Client "${data.name}" créé avec succès !`;

        // Si création de compte demandée, rediriger vers la page des comptes
        if (formValue.createAccount) {
          this.toastService.info(
            'Redirection vers la gestion des comptes...',
            'Information'
          );
          setTimeout(() => {
            this.router.navigateByUrl('/accounts');
          }, 2000);
        } else {
          // Réinitialiser le formulaire pour un nouveau client
          this.resetForm();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors de la création du client:', err);

        // Notification toast d'erreur
        this.toastService.error(
          'Erreur lors de la création du client. Veuillez réessayer.',
          'Erreur de création'
        );

        this.errorMessage =
          'Erreur lors de la création du client. Veuillez réessayer.';
      },
    });
  }

  getFieldError(fieldName: string): string | undefined {
    const field = this.newCustomerFormGroup.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors?.['email']) {
        return 'Adresse email invalide';
      }
      if (field.errors?.['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors?.['min']) {
        return 'Le montant doit être positif';
      }
    }
    return undefined;
  }

  resetForm(): void {
    this.newCustomerFormGroup.reset({
      createAccount: false,
      initialBalance: 0,
    });
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
}
