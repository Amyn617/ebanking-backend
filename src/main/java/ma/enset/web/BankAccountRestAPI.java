package ma.enset.web;

import lombok.AllArgsConstructor;
import ma.enset.dto.*;
import ma.enset.exceptions.*;
import ma.enset.service.BankService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class BankAccountRestAPI {
    private final BankService bankService;

    @GetMapping("/customers")
    public List<CustomerDTO> customers() {
        return bankService.listCustomers();
    }

    @PostMapping("/customers")
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO) {
        return bankService.saveCustomer(customerDTO);
    }

    @GetMapping("/accounts")
    public List<BankAccountDTO> accounts() {
        return bankService.listAccounts();
    }
    
    @PostMapping("/accounts/current")
    public BankAccountDTO saveCurrentAccount(@RequestParam double initialBalance,
                                             @RequestParam double overdraft,
                                             @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankService.saveCurrentAccount(initialBalance, overdraft, customerId);
    }

    @PostMapping("/accounts/saving")
    public BankAccountDTO saveSavingAccount(@RequestParam double initialBalance,
                                            @RequestParam double interestRate,
                                            @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankService.saveSavingAccount(initialBalance, interestRate, customerId);
    }
    
    @GetMapping("/accounts/{accountId}/operations")
    public List<AccountOperationDTO> accountOperations(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankService.listOperations(accountId);
    }    
    
    @PostMapping("/accounts/{accountId}/operations")
    public AccountOperationDTO saveOperation(@PathVariable String accountId,
                                             @RequestParam double amount,
                                             @RequestParam String type,
                                             @RequestParam(defaultValue = "") String description) 
                                             throws BankAccountNotFoundException, BalanceNotSufficientException {
        return bankService.saveOperation(accountId, amount, type, description);
    }
    
    @GetMapping("/customers/{customerId}")
    public CustomerDTO getCustomer(@PathVariable Long customerId) throws CustomerNotFoundException {
        return bankService.getCustomer(customerId);
    }

    @GetMapping("/customers/{customerId}/accounts")
    public List<BankAccountDTO> getCustomerAccounts(@PathVariable Long customerId) throws CustomerNotFoundException {
        return bankService.getCustomerAccounts(customerId);
    }

    @PutMapping("/customers/{customerId}")
    public CustomerDTO updateCustomer(@RequestBody CustomerDTO customerDTO, @PathVariable Long customerId) throws CustomerNotFoundException {
        customerDTO.setId(customerId);
        return bankService.updateCustomer(customerDTO);
    }

    @DeleteMapping("/customers/{customerId}")
    public void deleteCustomer(@PathVariable Long customerId) throws CustomerNotFoundException {
        bankService.deleteCustomer(customerId);
    }
    
    @GetMapping("/accounts/{accountId}")
    public BankAccountDTO getBankAccount(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankService.getBankAccount(accountId);
    }

    @PostMapping("/accounts/{accountId}/debit")
    public void debit(@PathVariable String accountId,
                      @RequestParam double amount,
                      @RequestParam(defaultValue = "") String description) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankService.debit(accountId, amount, description);
    }

    @PostMapping("/accounts/{accountId}/credit")
    public void credit(@PathVariable String accountId,
                       @RequestParam double amount,
                       @RequestParam(defaultValue = "") String description) throws BankAccountNotFoundException {
        bankService.credit(accountId, amount, description);
    }

    @PostMapping("/accounts/transfer")
    public void transfer(@RequestParam String accountIdSource,
                         @RequestParam String accountIdDestination,
                         @RequestParam double amount,
                         @RequestParam(defaultValue = "Transfer") String description) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankService.transfer(accountIdSource, accountIdDestination, amount, description);
    }

    @GetMapping("/accounts/{accountId}/history")
    public AccountHistoryDTO getAccountHistory(@PathVariable String accountId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "5") int size) throws BankAccountNotFoundException {
        return bankService.getAccountHistory(accountId, page, size);
    }
}
