package ma.enset.entities;

import lombok.*;

import jakarta.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("CA")
@Data @NoArgsConstructor @AllArgsConstructor
public class CurrentAccount extends BankAccount {
    private double overDraft;
}