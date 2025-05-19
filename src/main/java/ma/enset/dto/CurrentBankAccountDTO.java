package ma.enset.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class CurrentBankAccountDTO extends BankAccountDTO {
    private double overDraft;
    
    // Constructor to initialize all fields from parent class plus overDraft
    public CurrentBankAccountDTO(String id, double balance, Date createdAt, 
                                CustomerDTO customerDTO, double overDraft) {
        super();
        this.setId(id);
        this.setBalance(balance);
        this.setCreatedAt(createdAt);
        this.setCustomerDTO(customerDTO);
        this.setType("CURRENT");
        this.setOverDraft(overDraft);
    }
    
    // Default constructor for serialization/deserialization
    public CurrentBankAccountDTO() {
        super();
        this.setType("CURRENT");
    }
}
