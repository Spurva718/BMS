##
package com.scb.axessspringboottraining.service;
import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.exception.CustomerException;
import com.scb.axessspringboottraining.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
public class CustomerService implements ICustomer
{
    @Autowired
    CustomerRepository repo;
    //public List<Customer> list = new ArrayList<>();
    public CustomerService()
    {
        System.out.println("Service Constructor");
    }

    public List<Customer> getCustomer()
    {
        return repo.findAll();
    }


    public Customer addCustomer(Customer customer)
    {
//        list.add(customer);
//        System.out.println(list);
//        return customer;
        return repo.save(customer);
    }
    public Customer getCustomerbyId(int customerId) throws CustomerException
    {
        if(repo.existsById(customerId))
        {
            return repo.findById(customerId).get();
        }
        else {
            throw new CustomerException("Customer id not found");
        }
//        Customer customer= list.stream().filter((cust)->cust.getId()==customerId).findFirst().orElseThrow(()->new CustomerException("Customer ID"+customerId+"not found"));
//        return customer;

    }
    public Customer updateCustomer(int id,Customer customer) throws CustomerException
    {
        if(repo.existsById(id))
        {
            repo.save(customer);
            return customer;
        }
        else {
            throw new CustomerException("Id does not exist");
        }

    }
    public String deleteCustomer(int customerId) throws CustomerException
    {
        if(repo.existsById(customerId))
        {
            repo.deleteById(customerId);
            return "Customer Deleted successfully";
        }
        else {
            throw new CustomerException("Customer id not found");
        }
//        Customer existing = displayCustomer(customerId);
//        list.remove(existing);
//        return list;

    }


}
##
package com.scb.axessspringboottraining;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.exception.CustomerException;
import com.scb.axessspringboottraining.repository.CustomerRepository;
import com.scb.axessspringboottraining.service.CustomerService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.Optional;
@SpringBootTest
public class CustomerServiceTest {
    @Mock
    private CustomerRepository repository;
    @InjectMocks
    private CustomerService service;
    private Customer customer;
    @BeforeEach
    void setUp() {
        // MockitoAnnotations.openMocks(this);
        customer = new Customer();
        customer.setName("Purva");
    }
    // CREATE
    @Test
    void testCreateCustomer() {
        when(repository.save(customer)).thenReturn(customer);
        Customer saved = service.addCustomer(customer);
        assertNotNull(saved);
        assertEquals("Purva", saved.getName());
        verify(repository, times(1)).save(customer);
    }
    @Test
    void testGetCustomer() throws CustomerException {
        when(repository.findById(1)).thenReturn(Optional.of(customer));
        Customer found = service.getCustomerbyId(1);
        assertNotNull(found);
        assertEquals("Springboot", found.getName());
        verify(repository, times(1)).findById(1);
    }
}

@Test
void testCreateCustomer() {
    when(repository.save(customer)).thenReturn(customer);
    Customer saved = service.addCustomer(customer);
    assertNotNull(saved);
    assertEquals("Purva", saved.getName());
    verify(repository, times(1)).save(customer);
}

package com.scb.axessspringboottraining.service;
import com.scb.axessspringboottraining.entity.CreditCard;
import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.exception.CustomerException;
import com.scb.axessspringboottraining.repository.CustomerRepository;
import com.scb.axessspringboottraining.repository.ICreditCardRepository;
import com.scb.axessspringboottraining.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditCardService implements ICreditCardService
{
    @Autowired
    ICreditCardRepository repos;
    @Autowired
    CustomerRepository repo;

    public CreditCard createCreditCard(int customerId,CreditCard creditCard) throws CustomerException {
        Customer customer = repo.findById(customerId).orElseThrow(()-> new CustomerException("Customer not found"));
        creditCard.setCustomer(customer);
        return repos.save(creditCard);

    }
    public CreditCard getCreditCard(int card_id) throws CustomerException
    {
        return repos.findById(card_id).orElseThrow(()->new CustomerException("no credit card found"));
    }
    public CreditCard updateCreditCard(int customerId,CreditCard updatedCard) throws CustomerException {
        Customer customer = repo.findById(customerId).orElseThrow(()->new CustomerException("Customer not found"));
        CreditCard existingCard = repos.findById(updatedCard.getCard_id()).orElseThrow(()->new CustomerException("Credit card not found"));


        existingCard.setCardNumber(updatedCard.getCardNumber());
        return repos.save(existingCard);
    }

    public String deleteCreditCard(int card_id) throws CustomerException {
        if(!repos.existsById(card_id))
        {
            throw new CustomerException("Credit Card not found");
        }
        repos.deleteById(card_id);
        return "Credit Card deleted successfully";
    }

}
