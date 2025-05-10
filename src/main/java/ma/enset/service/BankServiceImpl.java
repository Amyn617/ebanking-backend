package ma.enset.service;

import lombok.AllArgsConstructor;
import ma.enset.dto.*;
import ma.enset.entities.*;
import ma.enset.enums.OperationType;
import ma.enset.repositories.*;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BankServiceImpl implements BankService {
    private final BankAccountRepository bankAccountRepository;
    private final AccountOperationRepository accountOperationRepository;

    @Override
    public AccountOperationDTO saveOperation(String accountId, double amount, String type) {
        BankAccount account = bankAccountRepository.findById(accountId).orElseThrow();
        AccountOperation op = AccountOperation.builder()
                .operationDate(new Date())
                .amount(amount)
                .type(OperationType.valueOf(type))
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