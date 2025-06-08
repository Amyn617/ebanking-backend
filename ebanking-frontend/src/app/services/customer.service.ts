import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.apiUrl}/customers`);
  }

  public getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(
      `${environment.apiUrl}/customers/${customerId}`
    );
  }

  public findCustomers(keyword: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${environment.apiUrl}/customers/search?keyword=${keyword}`
    );
  }

  public saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      `${environment.apiUrl}/customers`,
      customer
    );
  }

  public deleteCustomer(customerId: number) {
    return this.http.delete<Customer[]>(
      `${environment.apiUrl}/customers/${customerId}`
    );
  }
}
