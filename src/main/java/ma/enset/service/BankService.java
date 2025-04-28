package ma.enset.service;

import ma.enset.dto.*;

import java.util.List;

public interface BankService {
    CustomerDTO saveCustomer(CustomerDTO customerDTO);
    List<CustomerDTO> listCustomers();
    BankAccountDTO saveCurrentAccount(double initialBalance, double overdraft, Long customerId);
    BankAccountDTO saveSavingAccount(double initialBalance, double interestRate, Long customerId);
    List<BankAccountDTO> listAccounts();
    AccountOperationDTO saveOperation(String accountId, double amount, String type);
    List<AccountOperationDTO> listOperations(String accountId);
}
