package ma.enset.repositories;

import ma.enset.entities.BankAccount;
import ma.enset.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
	List<BankAccount> findByCustomerId(Long customerId);
	BankAccount findByIdAndCustomerId(String id, Long customerId);
	List<BankAccount> findByCustomer(Customer customer);
}