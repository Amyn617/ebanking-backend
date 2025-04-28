package ma.enset.dto;

import lombok.Data;
import java.util.Date;

@Data
public class BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private Long customerId;
    private String type; // "CURRENT" ou "SAVING"
    private Double overdraft; // pour CurrentAccount
    private Double interestRate; // pour SavingAccount
}
