package ma.enset.service;

import lombok.AllArgsConstructor;
import ma.enset.dto.*;
import ma.enset.entities.*;
import ma.enset.repositories.*;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BankServiceImpl implements BankService {
    private CustomerRepository customerRepository;
    private BankAccountRepository bankAccountRepository;
    private AccountOperationRepository accountOperationRepository;

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setName(customerDTO.getName());
        customer.setEmail(customerDTO.getEmail());
        Customer saved = customerRepository.save(customer);
        customerDTO.setId(saved.getId());
        return customerDTO;
    }

    @Override
    public List<CustomerDTO> listCustomers() {
        return customerRepository.findAll().stream().map(c -> {
            CustomerDTO dto = new CustomerDTO();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setEmail(c.getEmail());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public BankAccountDTO saveCurrentAccount(double initialBalance, double overdraft, Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow();
        CurrentAccount account = new CurrentAccount(
                UUID.randomUUID().toString(),
                initialBalance,
                new Date(),
                customer,
                null,
                overdraft
        );
        bankAccountRepository.save(account);
        BankAccountDTO dto = new BankAccountDTO();
        dto.setId(account.getId());
        dto.setBalance(account.getBalance());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setCustomerId(customerId);
        dto.setType("CURRENT");
        dto.setOverdraft(overdraft);
        return dto;
    }

    @Override
    public BankAccountDTO saveSavingAccount(double initialBalance, double interestRate, Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow();
        SavingAccount account = new SavingAccount(
                UUID.randomUUID().toString(),
                initialBalance,
                new Date(),
                customer,
                null,
                interestRate
        );
        bankAccountRepository.save(account);
        BankAccountDTO dto = new BankAccountDTO();
        dto.setId(account.getId());
        dto.setBalance(account.getBalance());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setCustomerId(customerId);
        dto.setType("SAVING");
        dto.setInterestRate(interestRate);
        return dto;
    }

    @Override
    public List<BankAccountDTO> listAccounts() {
        return bankAccountRepository.findAll().stream().map(acc -> {
            BankAccountDTO dto = new BankAccountDTO();
            dto.setId(acc.getId());
            dto.setBalance(acc.getBalance());
            dto.setCreatedAt(acc.getCreatedAt());
            dto.setCustomerId(acc.getCustomer().getId());
            if (acc instanceof CurrentAccount ca) {
                dto.setType("CURRENT");
                dto.setOverdraft(ca.getOverdraft());
            } else if (acc instanceof SavingAccount sa) {
                dto.setType("SAVING");
                dto.setInterestRate(sa.getInterestRate());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public AccountOperationDTO saveOperation(String accountId, double amount, String type) {
        BankAccount account = bankAccountRepository.findById(accountId).orElseThrow();
        AccountOperation op = AccountOperation.builder()
                .operationDate(new Date())
                .amount(amount)
                .type(type)
                .bankAccount(account)
                .build();
        accountOperationRepository.save(op);
        AccountOperationDTO dto = new AccountOperationDTO();
        dto.setId(op.getId());
        dto.setOperationDate(op.getOperationDate());
        dto.setAmount(op.getAmount());
        dto.setType(op.getType());
        dto.setBankAccountId(accountId);
        return dto;
    }

    @Override
    public List<AccountOperationDTO> listOperations(String accountId) {
        return accountOperationRepository.findAll().stream()
                .filter(op -> op.getBankAccount().getId().equals(accountId))
                .map(op -> {
                    AccountOperationDTO dto = new AccountOperationDTO();
                    dto.setId(op.getId());
                    dto.setOperationDate(op.getOperationDate());
                    dto.setAmount(op.getAmount());
                    dto.setType(op.getType());
                    dto.setBankAccountId(accountId);
                    return dto;
                }).collect(Collectors.toList());
    }
}
