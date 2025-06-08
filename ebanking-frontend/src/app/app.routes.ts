import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { NewOperationComponent } from './new-operation/new-operation.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customers/add',
    component: NewCustomerComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'operations',
    component: NewOperationComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'accounts/add-operation',
    component: NewOperationComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'customers/:id',
    component: CustomerAccountComponent,
    canActivate: [authGuard],
  },
];
