package ma.enset;

import ma.enset.entities.*;
import ma.enset.enums.AccountStatus;
import ma.enset.enums.OperationType;
import ma.enset.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@SpringBootApplication
public class MainApplication {
    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    @Bean
    @Transactional
    CommandLineRunner start(CustomerRepository customerRepository,
                            BankAccountRepository bankAccountRepository,
                            AccountOperationRepository accountOperationRepository) {
        return args -> {
            // Create customers
            Customer c1 = new Customer();
            c1.setName("Amine");
            c1.setEmail("amine@mail.com");
            c1 = customerRepository.save(c1);
            
            Customer c2 = new Customer();
            c2.setName("Smail");
            c2.setEmail("smail@mail.com");
            c2 = customerRepository.save(c2);

            // Create accounts
            CurrentAccount acc1 = new CurrentAccount();
            acc1.setId(UUID.randomUUID().toString());
            acc1.setBalance(10000);
            acc1.setCreatedAt(new Date());
            acc1.setCustomer(c1);
            acc1.setStatus(AccountStatus.ACTIVATED);
            acc1.setOverdraft(5000);
            bankAccountRepository.save(acc1);
            
            SavingAccount acc2 = new SavingAccount();
            acc2.setId(UUID.randomUUID().toString());
            acc2.setBalance(20000);
            acc2.setCreatedAt(new Date());
            acc2.setCustomer(c2);
            acc2.setStatus(AccountStatus.ACTIVATED);
            acc2.setInterestRate(3.5);
            bankAccountRepository.save(acc2);

            // Create operations
            AccountOperation op1 = new AccountOperation();
            op1.setOperationDate(new Date());
            op1.setAmount(1000);
            op1.setType(OperationType.DEBIT);
            op1.setBankAccount(acc1);
            accountOperationRepository.save(op1);
            
            AccountOperation op2 = new AccountOperation();
            op2.setOperationDate(new Date());
            op2.setAmount(2000);
            op2.setType(OperationType.CREDIT);
            op2.setBankAccount(acc2);
            accountOperationRepository.save(op2);
        };
    }
}