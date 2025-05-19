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
@DiscriminatorValue("CURRENT")
public class CurrentAccount extends BankAccount {
    private double overdraft;
    
    public CurrentAccount(String id, double balance, Date createdAt, Customer customer, 
                         List<AccountOperation> accountOperations, double overdraft) {
        super(id, balance, createdAt, customer, accountOperations);
        this.overdraft = overdraft;
    }
    
    public void setOverDraft(double overdraft) {
        this.overdraft = overdraft;
    }

    public double getOverdraft() {
        return overdraft;
    }

    public void setOverdraft(double overdraft) {
        this.overdraft = overdraft;
    }
}
