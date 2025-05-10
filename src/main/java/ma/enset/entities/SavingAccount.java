package ma.enset.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("SAVING")
public class SavingAccount extends BankAccount {
    private double interestRate;
    
    public SavingAccount(String id, double balance, Date createdAt, Customer customer, 
                         List<AccountOperation> accountOperations, double interestRate) {
        super(id, balance, createdAt, customer, accountOperations);
        this.interestRate = interestRate;
    }
}
