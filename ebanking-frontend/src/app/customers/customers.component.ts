import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../shared/services/toast.service';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';
import { InputComponent } from '../shared/components/input/input.component';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    AlertComponent,
  ],
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  customers$: Observable<Customer[]>;
  searchFormGroup: FormGroup;
  isAdmin: boolean = false;
  errorMessage: string = '';

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    // Initialize the customers$ Observable
    this.customers$ = this.customerService.getCustomers();

    // Initialize search form
    this.searchFormGroup = this.fb.group({
      keyword: [''],
    });
  }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    console.log('User is admin:', this.isAdmin); // Debug log
  }

  findCustomers(keyword: string) {
    if (keyword.trim()) {
      this.customers$ = this.customerService.findCustomers(keyword);
    } else {
      this.customers$ = this.customerService.getCustomers();
    }
  }

  handleDeleteCustomer(customerId: number) {
    console.log('Delete customer called for ID:', customerId); // Debug log
    console.log('Is admin:', this.isAdmin); // Debug log

    if (!this.isAdmin) {
      this.toastService.error(
        "Vous n'avez pas les permissions pour supprimer un client",
        'Accès refusé'
      );
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

    this.customerService.deleteCustomer(customerId).subscribe({
      next: () => {
        // Refresh the customers list after deletion
        this.customers$ = this.customerService.getCustomers();
        this.toastService.success(
          'Client supprimé avec succès',
          'Suppression réussie'
        );
      },
      error: (err) => {
        console.error('Error deleting customer:', err);
        this.errorMessage = 'Erreur lors de la suppression du client';
        this.toastService.error(
          'Erreur lors de la suppression du client',
          'Erreur de suppression'
        );
      },
    });
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
