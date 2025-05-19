package ma.enset.dto;

import lombok.Data;
import java.util.Date;

@Data
public class BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private CustomerDTO customerDTO;
    private String type; // "CURRENT" ou "SAVING"
    private double overDraft; // pour CurrentAccount
    private double interestRate; // pour SavingAccount
}
