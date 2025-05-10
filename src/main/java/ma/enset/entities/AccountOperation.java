package ma.enset.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "bankAccount") // Exclude bankAccount from toString to prevent recursion
public class AccountOperation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date operationDate;
    private double amount;
    private String type;

    @ManyToOne(fetch = FetchType.EAGER)
    private BankAccount bankAccount;
}
