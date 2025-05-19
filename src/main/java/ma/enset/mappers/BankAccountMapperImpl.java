package ma.enset.mappers;

import ma.enset.dto.AccountOperationDTO;
import ma.enset.dto.BankAccountDTO;
import ma.enset.dto.CustomerDTO;
import ma.enset.entities.AccountOperation;
import ma.enset.entities.BankAccount;
import ma.enset.entities.CurrentAccount;
import ma.enset.entities.Customer;
import ma.enset.entities.SavingAccount;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class BankAccountMapperImpl {
    public CustomerDTO fromCustomer(Customer customer) {
        CustomerDTO customerDTO = new CustomerDTO();
        BeanUtils.copyProperties(customer, customerDTO);
        return customerDTO;
    }

    public Customer fromCustomerDTO(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerDTO, customer);
        return customer;
    }

    public BankAccountDTO fromBankAccount(BankAccount bankAccount) {
        BankAccountDTO bankAccountDTO = new BankAccountDTO();
        BeanUtils.copyProperties(bankAccount, bankAccountDTO);
        bankAccountDTO.setCustomerDTO(fromCustomer(bankAccount.getCustomer()));
        if (bankAccount instanceof SavingAccount) {
            bankAccountDTO.setType("SAVING");
            bankAccountDTO.setInterestRate(((SavingAccount) bankAccount).getInterestRate());        } else if (bankAccount instanceof CurrentAccount) {
            bankAccountDTO.setType("CURRENT");
            bankAccountDTO.setOverDraft(((CurrentAccount) bankAccount).getOverdraft());
        }
        return bankAccountDTO;
    }

    public AccountOperationDTO fromAccountOperation(AccountOperation accountOperation) {
        AccountOperationDTO accountOperationDTO = new AccountOperationDTO();
        BeanUtils.copyProperties(accountOperation, accountOperationDTO);
        return accountOperationDTO;
    }
}
