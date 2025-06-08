import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountDetails, AccountOperation } from '../model/account.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  public getAccount(
    accountId: string,
    page: number = 0
  ): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(
      `${environment.apiUrl}/accounts/${accountId}/pageOperations?page=${page}`
    );
  }

  public saveOperation(accountId: number, operation: AccountOperation) {
    return this.http.post(
      `${environment.apiUrl}/accounts/${accountId}/operations`,
      operation
    );
  }
}
