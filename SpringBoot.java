package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.service.ICustomer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private ICustomer customerService;

    // Create
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.addCustomer(customer);
    }

    // Read all
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // Read by id
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    // Update
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return customerService.updateCustomer(id, customer);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable Long id) {
        return customerService.deleteCustomer(id);
    }
}


package com.example.demo.service;

import com.example.demo.entity.Customer;
import java.util.List;

public interface ICustomer {
    Customer addCustomer(Customer customer);
    List<Customer> getAllCustomers();
    Customer getCustomerById(Long id);
    Customer updateCustomer(Long id, Customer customer);
    String deleteCustomer(Long id);
}

package com.example.demo.service;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService implements ICustomer {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        existing.setName(customer.getName());
        return customerRepository.save(existing);
    }

    @Override
    public String deleteCustomer(Long id) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        customerRepository.delete(existing);
        return "Customer deleted with id: " + id;
    }
}

****
package com.scb.ems.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int customerId;

    @Column(nullable = false)
    private String name;

    @Column
    private String address;
}

package com.scb.ems.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

package com.scb.ems.repository;

import com.scb.ems.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICustomerRep extends JpaRepository<Customer, Integer> {
}

package com.scb.ems.service;

import com.scb.ems.entity.Customer;
import java.util.List;

public interface ICustomer {
    Customer addCustomer(Customer customer);
    Customer getCustomerById(int id);
    List<Customer> getAllCustomers();
    Customer updateCustomer(int id, Customer customer);
    Customer deleteCustomer(int id);
}


package com.scb.ems.service;

import com.scb.ems.entity.Customer;
import com.scb.ems.exception.ResourceNotFoundException;
import com.scb.ems.repository.ICustomerRep;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements ICustomer {

    private final ICustomerRep repo;

    public CustomerServiceImpl(ICustomerRep repo) {
        this.repo = repo;
    }

    @Override
    public Customer addCustomer(Customer customer) {
        return repo.save(customer);
    }

    @Override
    public Customer getCustomerById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
    }

    @Override
    public List<Customer> getAllCustomers() {
        return repo.findAll();
    }

    @Override
    public Customer updateCustomer(int id, Customer customer) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));

        existing.setName(customer.getName());
        existing.setAddress(customer.getAddress());

        return repo.save(existing);
    }

    @Override
    public Customer deleteCustomer(int id) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));

        repo.delete(existing);
        return existing; // return deleted object
    }
}


package com.scb.ems.controller;

import com.scb.ems.entity.Customer;
import com.scb.ems.service.ICustomer;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final ICustomer service;

    public CustomerController(ICustomer service) {
        this.service = service;
    }

    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return service.addCustomer(customer);
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable int id) {
        return service.getCustomerById(id);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return service.getAllCustomers();
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable int id, @RequestBody Customer customer) {
        return service.updateCustomer(id, customer);
    }

    @DeleteMapping("/{id}")
    public Customer deleteCustomer(@PathVariable int id) {
        return service.deleteCustomer(id);
    }
}

package com.scb.ems.controller;

import com.scb.ems.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception ex) {
        return new ResponseEntity<>("Internal Server Error: " + ex.getMessage(),
                                    HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


CREATE DATABASE customerdb;
\c customerdb;

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255)
);
