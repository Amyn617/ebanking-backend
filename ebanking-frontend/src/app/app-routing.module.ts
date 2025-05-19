import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { CustomersAccountsComponent } from './customers-accounts/customers-accounts.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuard],
  },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  {
    path: 'new-customer',
    component: NewCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-customer/:id',
    component: EditCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customers-accounts/:id',
    component: CustomersAccountsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
