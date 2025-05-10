package ma.enset.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.enset.enums.AccountStatus;

import java.util.Date;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TYPE", length = 10)
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"customer", "accountOperations"}) // Exclude from toString to prevent recursion
public abstract class BankAccount {
    @Id
    private String id;
    private double balance;
    private Date createdAt;
    
    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    private Customer customer;

    @OneToMany(mappedBy = "bankAccount", fetch = FetchType.LAZY)
    private List<AccountOperation> accountOperations;
    
    // Constructor used by subclasses without status
    public BankAccount(String id, double balance, Date createdAt, Customer customer, List<AccountOperation> accountOperations) {
        this.id = id;
        this.balance = balance;
        this.createdAt = createdAt;
        this.customer = customer;
        this.accountOperations = accountOperations;
        this.status = AccountStatus.CREATED;  // Default status
    }
}
