package ma.enset;

import ma.enset.entities.*;
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
    @Transactional // Add transactional to ensure the session remains open
    CommandLineRunner start(CustomerRepository customerRepository,
                            BankAccountRepository bankAccountRepository,
                            AccountOperationRepository accountOperationRepository) {
        return args -> {
            Customer c1 = customerRepository.save(Customer.builder().name("Amine").email("amine@mail.com").build());
            Customer c2 = customerRepository.save(Customer.builder().name("Smail").email("smail@mail.com").build());

            BankAccount acc1 = bankAccountRepository.save(
                    new CurrentAccount(UUID.randomUUID().toString(), 10000, new Date(), c1, null, 5000)
            );
            BankAccount acc2 = bankAccountRepository.save(
                    new SavingAccount(UUID.randomUUID().toString(), 20000, new Date(), c2, null, 3.5)
            );

            accountOperationRepository.save(AccountOperation.builder()
                    .operationDate(new Date())
                    .amount(1000)
                    .type("DEBIT")
                    .bankAccount(acc1)
                    .build());
            accountOperationRepository.save(AccountOperation.builder()
                    .operationDate(new Date())
                    .amount(2000)
                    .type("CREDIT")
                    .bankAccount(acc2)
                    .build());

            System.out.println("Customers:");
            customerRepository.findAll().forEach(customer -> 
                System.out.println(String.format("Customer ID: %d, Name: %s, Email: %s", 
                    customer.getId(), customer.getName(), customer.getEmail())));

            System.out.println("Accounts:");
            bankAccountRepository.findAll().forEach(account -> 
                System.out.println(String.format("Account ID: %s, Balance: %.2f, Customer: %s", 
                    account.getId(), account.getBalance(), account.getCustomer().getName())));

            System.out.println("Operations:");
            accountOperationRepository.findAll().forEach(op -> 
                System.out.println(String.format("Operation ID: %d, Amount: %.2f, Type: %s, Account: %s", 
                    op.getId(), op.getAmount(), op.getType(), op.getBankAccount().getId())));
        };
    }
}