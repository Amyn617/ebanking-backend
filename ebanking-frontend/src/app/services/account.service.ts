import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = environment.apiUrl + '/accounts';

  constructor(private http: HttpClient) {}

  getAccount(accountId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${accountId}`);
  }

  getAccountOperations(
    accountId: string,
    page: number,
    size: number
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${accountId}/operations?page=${page}&size=${size}`
    );
  }

  debit(
    accountId: string,
    amount: number,
    description: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${accountId}/debit`, {
      amount,
      description,
    });
  }

  credit(
    accountId: string,
    amount: number,
    description: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${accountId}/credit`, {
      amount,
      description,
    });
  }

  transfer(
    accountSource: string,
    accountDestination: string,
    amount: number,
    description: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, {
      accountSource,
      accountDestination,
      amount,
      description,
    });
  }
}
