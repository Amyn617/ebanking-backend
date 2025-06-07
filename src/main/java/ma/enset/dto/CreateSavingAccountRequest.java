package ma.enset.dto;

import lombok.Data;

@Data
public class CreateSavingAccountRequest {
    private double initialBalance;
    private double interestRate;
    private Long customerId;
}
