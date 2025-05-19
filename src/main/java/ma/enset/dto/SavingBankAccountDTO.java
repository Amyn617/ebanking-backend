package ma.enset.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class SavingBankAccountDTO extends BankAccountDTO {
    private double interestRate;
    
    // Constructor to initialize all fields from parent class plus interestRate
    public SavingBankAccountDTO(String id, double balance, Date createdAt, 
                               CustomerDTO customerDTO, double interestRate) {
        super();
        this.setId(id);
        this.setBalance(balance);
        this.setCreatedAt(createdAt);
        this.setCustomerDTO(customerDTO);
        this.setType("SAVING");
        this.setInterestRate(interestRate);
    }
    
    // Default constructor for serialization/deserialization
    public SavingBankAccountDTO() {
        super();
        this.setType("SAVING");
    }
}
