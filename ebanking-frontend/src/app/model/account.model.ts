import { Customer } from './customer.model';
import { AccountStatus } from './enums/account_status.enum';
import { OperationType } from './enums/operation_type.enum';

export interface AccountDetails {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
  accountOperations: AccountOperation[];
}

export interface AccountOperation {
  id: number;
  operationDate: string;
  amount: number;
  type: OperationType;
  description: string;
}
