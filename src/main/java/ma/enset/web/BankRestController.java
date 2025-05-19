package ma.enset.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.dto.AccountHistoryDTO;
import ma.enset.dto.AccountOperationDTO;
import ma.enset.dto.BankAccountDTO;
import ma.enset.exceptions.BankAccountNotFoundException;
import ma.enset.service.BankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banking")
@AllArgsConstructor
@Slf4j
public class BankRestController {
    private final BankService bankService;
    
    @GetMapping("/accounts")
    public List<BankAccountDTO> getAllAccounts() {
        return bankService.listAccounts();
    }
    
    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<BankAccountDTO> getAccount(@PathVariable String accountId) {
        try {
            BankAccountDTO accountDTO = bankService.getBankAccount(accountId);
            return ResponseEntity.ok(accountDTO);
        } catch (BankAccountNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/accounts/{accountId}/history")
    public ResponseEntity<AccountHistoryDTO> getAccountHistory(
            @PathVariable String accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            AccountHistoryDTO history = bankService.getAccountHistory(accountId, page, size);
            return ResponseEntity.ok(history);
        } catch (BankAccountNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/accounts/{accountId}/operations")
    public ResponseEntity<List<AccountOperationDTO>> getAccountOperations(@PathVariable String accountId) {
        try {
            List<AccountOperationDTO> operations = bankService.listOperations(accountId);
            return ResponseEntity.ok(operations);
        } catch (BankAccountNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/accounts/{accountId}/debit")
    public ResponseEntity<?> debitAccount(
            @PathVariable String accountId,
            @RequestParam double amount,
            @RequestParam(required = false, defaultValue = "") String description) {
        try {
            bankService.debit(accountId, amount, description);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/accounts/{accountId}/credit")
    public ResponseEntity<?> creditAccount(
            @PathVariable String accountId,
            @RequestParam double amount,
            @RequestParam(required = false, defaultValue = "") String description) {
        try {
            bankService.credit(accountId, amount, description);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @RequestParam String sourceAccountId,
            @RequestParam String destinationAccountId,
            @RequestParam double amount,
            @RequestParam(required = false, defaultValue = "Transfer") String description) {
        try {
            bankService.transfer(sourceAccountId, destinationAccountId, amount, description);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
