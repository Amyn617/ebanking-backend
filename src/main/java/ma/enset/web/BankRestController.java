package ma.enset.web;

import lombok.AllArgsConstructor;
import ma.enset.dto.*;
import ma.enset.service.BankService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class BankRestController {
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
                                             @RequestParam Long customerId) {
        return bankService.saveCurrentAccount(initialBalance, overdraft, customerId);
    }

    @PostMapping("/accounts/saving")
    public BankAccountDTO saveSavingAccount(@RequestParam double initialBalance,
                                            @RequestParam double interestRate,
                                            @RequestParam Long customerId) {
        return bankService.saveSavingAccount(initialBalance, interestRate, customerId);
    }

    @GetMapping("/accounts/{accountId}/operations")
    public List<AccountOperationDTO> accountOperations(@PathVariable String accountId) {
        return bankService.listOperations(accountId);
    }

    @PostMapping("/accounts/{accountId}/operations")
    public AccountOperationDTO saveOperation(@PathVariable String accountId,
                                             @RequestParam double amount,
                                             @RequestParam String type) {
        return bankService.saveOperation(accountId, amount, type);
    }
}
