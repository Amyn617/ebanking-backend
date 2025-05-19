package ma.enset.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.dto.CustomerDTO;
import ma.enset.exceptions.CustomerNotFoundException;
import ma.enset.service.BankService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-management") // Changed from "/api/customers" to avoid conflict
@AllArgsConstructor
@Slf4j
public class CustomerRostController {
    private final BankService bankService;

    @GetMapping
    public List<CustomerDTO> getAllCustomers() {
        return bankService.listCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable Long id) {
        try {
            CustomerDTO customerDTO = bankService.getCustomer(id);
            return ResponseEntity.ok(customerDTO);
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO) {
        return bankService.saveCustomer(customerDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        try {
            customerDTO.setId(id);
            CustomerDTO updatedCustomer = bankService.updateCustomer(customerDTO);
            return ResponseEntity.ok(updatedCustomer);
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            bankService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}/accounts")
    public ResponseEntity<List<ma.enset.dto.BankAccountDTO>> getCustomerAccounts(@PathVariable Long id) {
        try {
            List<ma.enset.dto.BankAccountDTO> accounts = bankService.getCustomerAccounts(id);
            return ResponseEntity.ok(accounts);
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
