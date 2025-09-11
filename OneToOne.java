package com.scb.axessspringboottraining.entity;
import jakarta.persistence.*;

@Entity
public class Customer{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable=false)
    private String name;
    @Column (nullable=false,unique=true)
    private String email;
    public Customer(){}
    public Customer(Integer id,String name,String email){
        this.id=id;
        this.name=name;
        this.email=email;
    }
    public Integer getId(){
        return id;
    }
    public boolean setId(Integer id){
        this.id=id;
        return true;
    }
    public String getName(){

        return this.name;
    }
    public boolean setName(String name){
        this.name=name;
        return true;
    }

    public String getEmail(){
        return this.email;
    }
    public boolean setEmail(String email){
        this.email=email;
        return true;
    }

    @OneToOne(mappedBy = "customer",cascade = CascadeType.ALL)
    private Credit credit;
}

package com.scb.axessspringboottraining.entity;
import jakarta.persistence.*;

@Entity
public class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer creditId;
    private Integer cardNo;
    public Credit(Integer creditId,Integer cardNo){
        this.creditId=creditId;
        this.cardNo=cardNo;
    }
    public Integer getCreditId() {
        return creditId;
    }
    public Integer getCardNo() {
        return cardNo;
    }
    public void setCreditId(Integer creditId) {
        this.creditId = creditId;
    }
    public void setCardNo(Integer cardNo) {
        this.cardNo = cardNo;
    }
    public Credit getCredit() {
        return credit;
    }

    @OneToOne
    @JoinColumn(name="id",referencedColumnName = "customerId")
    private Credit credit;

}
package com.scb.axessspringboottraining.exception;

public class CustomerNotFoundException extends RuntimeException{
    public CustomerNotFoundException(String message){
        super(message);
    }
}
package com.scb.axessspringboottraining.exception;

import com.scb.axessspringboottraining.entity.Credit;

public class CreditNotFoundException  extends RuntimeException{
    public CreditNotFoundException(String message){
        super(message);
    }
}

package com.scb.axessspringboottraining.exception;
import com.scb.axessspringboottraining.exception.CustomerNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle CustomerNotFoundException
    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleCustomerNotFound(CustomerNotFoundException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("error", "Customer Not Found");
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}

package com.scb.axessspringboottraining.repository;

import com.scb.axessspringboottraining.entity.Credit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditRepository extends JpaRepository<Credit,Integer> {

}

package com.scb.axessspringboottraining.repository;
import com.scb.axessspringboottraining.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {
}


package com.scb.axessspringboottraining.controller;
import com.scb.axessspringboottraining.entity.Credit;
import com.scb.axessspringboottraining.service.ICredit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/credit-cards")
public class CreditController {
    @Autowired
    private ICredit creditCardService;
    @GetMapping
    public List<Credit> getAllCredit() {
        return creditCardService.getAllCredits();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Credit> getCreditById(@PathVariable int id) {
        Credit credit = creditCardService.getCreditById(id);
        return new ResponseEntity<>(credit, HttpStatus.OK);
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Credit addCredit(@RequestBody Credit credit) {
        return creditCardService.addCredit(credit);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Credit> updateCredit(@PathVariable int id, @RequestBody Credit credit) {
        Credit updatedCard = creditCardService.updateCredit(id,credit);
        return new ResponseEntity<>(updatedCard, HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredit(@PathVariable int id) {
        if (creditCardService.deleteCredit(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
package com.scb.axessspringboottraining.controller;
import com.scb.axessspringboottraining.entity.Credit;
import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.service.ICustomer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.scb.axessspringboottraining.exception.CustomerNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
//@RequestMapping("/api/vi/customers")
public class CustomerController{

    public CustomerController(){
        System.out.println("Customer controller called");
    }
    @Autowired
    private ICustomer customerService;

    @RequestMapping(value = "/getCustomer", method= RequestMethod.GET)
    public List<Customer> getAllCustomers(){
        return customerService.getAllCustomers();
    }

    @RequestMapping(value = "/getCustomer/{id}", method = RequestMethod.GET )
    public Customer getCustomerById(@PathVariable int id) throws CustomerNotFoundException {
        return customerService.getCustomerById(id);
    }
    @RequestMapping(value = "/addCustomer",method= RequestMethod.POST)
    public Customer addCustomer(@RequestBody Customer customer){
        return customerService.addCustomer(customer);
    }

    @RequestMapping(value="/updateCustomer/{id}" ,method = RequestMethod.PUT)
    public Customer updateCustomer(@PathVariable int id,@RequestBody Customer updatedCustomer) throws CustomerNotFoundException{
        return customerService.updateCustomer(id,updatedCustomer);
    }

    @RequestMapping(value ="/deleteCustomer/{id}",method = RequestMethod.DELETE)
    public String deleteCustomer( @PathVariable int id)  throws CustomerNotFoundException{
        boolean removed=customerService.deleteCustomer(id);
        return "Deleted Successfully!!!";

    }

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity handleException(CustomerNotFoundException ex){
        return new ResponseEntity(ex.getMessage(), HttpStatus.NOT_FOUND);
    }


}

package com.scb.axessspringboottraining.service;

import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.exception.CustomerNotFoundException;

import java.util.List;
public interface ICustomer {

    List<Customer> getAllCustomers();
    Customer getCustomerById(int id) throws CustomerNotFoundException;
    Customer addCustomer(Customer customer);
    Customer updateCustomer(int id ,Customer customer) throws CustomerNotFoundException ;
    public boolean deleteCustomer(int id) throws CustomerNotFoundException  ;

}

package com.scb.axessspringboottraining.service;
import com.scb.axessspringboottraining.entity.Credit;
import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.exception.CustomerNotFoundException;

import java.util.List;

public interface ICredit {

    Credit addCredit(Credit credit);

    List<Credit> getAllCredits();

    Credit getCreditById(int id) throws CustomerNotFoundException;

    Credit updateCredit(int id ,Credit credit) throws CustomerNotFoundException ;

    public boolean deleteCredit(int id) throws CustomerNotFoundException  ;

}

package com.scb.axessspringboottraining.service;
import com.scb.axessspringboottraining.entity.Credit;
//import com.scb.axessspringboottraining.entity.ICredit;
import com.scb.axessspringboottraining.exception.CreditNotFoundException;
import com.scb.axessspringboottraining.repository.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CreditService implements ICredit {
    @Autowired
    private CreditRepository creditCardRepository;
    @Override
    public Credit addCredit(Credit credit) {
        return creditCardRepository.save(credit);
    }

    @Override
    public List<Credit> getAllCredits() {
        return creditCardRepository.findAll();
    }
    @Override
    public Credit getCreditById(int id) throws CreditNotFoundException {
        return creditCardRepository.findById(id)
                .orElseThrow(() -> new CreditNotFoundException("Credit card with id " + id + " not found."));
    }
    @Override
    public Credit updateCredit(int id, Credit updatedCard) throws CreditNotFoundException {
        Credit card = creditCardRepository.findById(id)
                .orElseThrow(() -> new CreditNotFoundException("Credit card with id " + id + " not found."));
        card.setCardNo(updatedCard.getCardNo());
        //card.setCustomer(updatedCard.getCustomer());
        return creditCardRepository.save(card);
    }

    @Override
    public boolean deleteCredit(int id) {
        if (creditCardRepository.existsById(id)) {
            creditCardRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
package com.scb.axessspringboottraining.service;
import com.scb.axessspringboottraining.entity.Customer;
import java.util.ArrayList;
import com.scb.axessspringboottraining.exception.CustomerNotFoundException;
import com.scb.axessspringboottraining.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CustomerService implements ICustomer{

    @Autowired
    private CustomerRepository repo;


    @Override
    public List<Customer> getAllCustomers() {
        return repo.findAll();
    }

    @Override
    public Customer getCustomerById(int id) throws CustomerNotFoundException {
        return repo.findById(id).orElseThrow(()-> new CustomerNotFoundException("Costomer not found while getting!!!"));
    }

    @Override
    public Customer addCustomer(Customer customer) {
        return repo.save(customer);
    }

    @Override
    public Customer updateCustomer(int id, Customer customer) throws CustomerNotFoundException {
        if(!repo.existsById(id)){
            throw new CustomerNotFoundException("Customer not found!!");
        }


        Customer existing=repo.getById(id);
        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        return repo.save(existing);
    }

    @Override
    public boolean deleteCustomer(int id) throws CustomerNotFoundException {

        if(!repo.existsById(id)){
            throw new CustomerNotFoundException("Customer not found!! while deletion");

        }
        repo.deleteById(id);
        return true;

    }
}




package com.scb.axessspringboottraining.entity;

import jakarta.persistence.*;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable=false)
    private String name;

    @Column(nullable=false, unique=true)
    private String email;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL)
    private Credit credit;

    public Customer() {}

    public Customer(Integer id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Credit getCredit() { return credit; }
    public void setCredit(Credit credit) { 
        this.credit = credit;
        credit.setCustomer(this);  // maintain bidirectional consistency
    }
}

package com.scb.axessspringboottraining.entity;

import jakarta.persistence.*;

@Entity
public class Credit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer creditId;

    @Column(nullable=false, unique=true)
    private Integer cardNo;

    @OneToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;

    public Credit() {}

    public Credit(Integer creditId, Integer cardNo) {
        this.creditId = creditId;
        this.cardNo = cardNo;
    }

    public Integer getCreditId() { return creditId; }
    public void setCreditId(Integer creditId) { this.creditId = creditId; }

    public Integer getCardNo() { return cardNo; }
    public void setCardNo(Integer cardNo) { this.cardNo = cardNo; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
}

package com.scb.axessspringboottraining.controller;

import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.exception.CustomerNotFoundException;
import com.scb.axessspringboottraining.service.ICustomer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private ICustomer customerService;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable int id) throws CustomerNotFoundException {
        Customer customer = customerService.getCustomerById(id);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer addCustomer(@RequestBody Customer customer) {
        return customerService.addCustomer(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable int id,
                                                   @RequestBody Customer updatedCustomer) throws CustomerNotFoundException {
        Customer customer = customerService.updateCustomer(id, updatedCustomer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable int id) throws CustomerNotFoundException {
        if (customerService.deleteCustomer(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

package com.scb.axessspringboottraining.controller;

import com.scb.axessspringboottraining.entity.Credit;
import com.scb.axessspringboottraining.exception.CreditNotFoundException;
import com.scb.axessspringboottraining.service.ICredit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
public class CreditController {

    @Autowired
    private ICredit creditService;

    @GetMapping
    public List<Credit> getAllCredits() {
        return creditService.getAllCredits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Credit> getCreditById(@PathVariable int id) throws CreditNotFoundException {
        Credit credit = creditService.getCreditById(id);
        return new ResponseEntity<>(credit, HttpStatus.OK);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Credit addCredit(@RequestBody Credit credit) {
        return creditService.addCredit(credit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Credit> updateCredit(@PathVariable int id,
                                               @RequestBody Credit credit) throws CreditNotFoundException {
        Credit updatedCredit = creditService.updateCredit(id, credit);
        return new ResponseEntity<>(updatedCredit, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredit(@PathVariable int id) {
        if (creditService.deleteCredit(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

package com.scb.axessspringboottraining.service;

import com.scb.axessspringboottraining.entity.Customer;
import com.scb.axessspringboottraining.exception.CustomerNotFoundException;
import com.scb.axessspringboottraining.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService implements ICustomer {

    @Autowired
    private CustomerRepository repo;

    @Override
    public List<Customer> getAllCustomers() {
        return repo.findAll();
    }

    @Override
    public Customer getCustomerById(int id) throws CustomerNotFoundException {
        return repo.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found!"));
    }

    @Override
    public Customer addCustomer(Customer customer) {
        return repo.save(customer);
    }

    @Override
    public Customer updateCustomer(int id, Customer customer) throws CustomerNotFoundException {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found!"));

        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        existing.setCredit(customer.getCredit()); // update credit if provided

        return repo.save(existing);
    }

    @Override
    public boolean deleteCustomer(int id) throws CustomerNotFoundException {
        if (!repo.existsById(id)) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found while deletion!");
        }
        repo.deleteById(id);
        return true;
    }
}

package com.scb.axessspringboottraining.service;

import com.scb.axessspringboottraining.entity.Credit;
import com.scb.axessspringboottraining.exception.CreditNotFoundException;
import com.scb.axessspringboottraining.repository.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditService implements ICredit {

    @Autowired
    private CreditRepository repo;

    @Override
    public Credit addCredit(Credit credit) {
        return repo.save(credit);
    }

    @Override
    public List<Credit> getAllCredits() {
        return repo.findAll();
    }

    @Override
    public Credit getCreditById(int id) throws CreditNotFoundException {
        return repo.findById(id)
                .orElseThrow(() -> new CreditNotFoundException("Credit card with id " + id + " not found!"));
    }

    @Override
    public Credit updateCredit(int id, Credit updatedCredit) throws CreditNotFoundException {
        Credit existing = repo.findById(id)
                .orElseThrow(() -> new CreditNotFoundException("Credit card with id " + id + " not found!"));

        existing.setCardNo(updatedCredit.getCardNo());
        existing.setCustomer(updatedCredit.getCustomer());

        return repo.save(existing);
    }

    @Override
    public boolean deleteCredit(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
