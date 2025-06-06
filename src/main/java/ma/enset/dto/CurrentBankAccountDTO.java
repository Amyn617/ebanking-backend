package ma.enset.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.enset.enums.AccountStatus;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
public class CurrentBankAccountDTO extends BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private AccountStatus status;
    private CustomerDTO customerDTO;
    private double overDraft;
}