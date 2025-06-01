package ma.enset.repositories;

import ma.enset.entities.BankAccount;
import ma.enset.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount,String> {
}