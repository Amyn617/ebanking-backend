package ma.enset.service;

import ma.enset.dto.*;
import ma.enset.exceptions.*;

import java.util.List;

public interface BankService {
    CustomerDTO saveCustomer(CustomerDTO customerDTO);
    List<CustomerDTO> listCustomers();
    CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException;
    CustomerDTO updateCustomer(CustomerDTO customerDTO) throws CustomerNotFoundException;
    void deleteCustomer(Long customerId) throws CustomerNotFoundException;

    BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException;
    BankAccountDTO saveCurrentAccount(double initialBalance, double overdraft, Long customerId) throws CustomerNotFoundException;
    BankAccountDTO saveSavingAccount(double initialBalance, double interestRate, Long customerId) throws CustomerNotFoundException;
    List<BankAccountDTO> listAccounts();
    List<BankAccountDTO> getCustomerAccounts(Long customerId) throws CustomerNotFoundException;

    void debit(String accountId, double amount, String description) throws BankAccountNotFoundException, BalanceNotSufficientException;
    void credit(String accountId, double amount, String description) throws BankAccountNotFoundException;
    void transfer(String accountIdSource, String accountIdDestination, double amount, String description) throws BankAccountNotFoundException, BalanceNotSufficientException;

    List<AccountOperationDTO> accountHistory(String accountId) throws BankAccountNotFoundException;
    AccountHistoryDTO getAccountHistory(String accountId, int page, int size) throws BankAccountNotFoundException;
      // Methods used in controller but missing in interface
    List<AccountOperationDTO> listOperations(String accountId) throws BankAccountNotFoundException;
    AccountOperationDTO saveOperation(String accountId, double amount, String type, String description) throws BankAccountNotFoundException, BalanceNotSufficientException;
}
