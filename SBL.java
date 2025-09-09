package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
}

package com.example.demo.exception;

public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) {
        super(message);
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
import com.example.demo.exception.CustomerNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService implements ICustomer {

    private final List<Customer> customers = new ArrayList<>();
    private long nextId = 1;

    @Override
    public Customer addCustomer(Customer customer) {
        customer.setId(nextId++);
        customers.add(customer);
        return customer;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customers;
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customers.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + id));
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) {
        Customer existing = getCustomerById(id);
        existing.setName(customer.getName());
        existing.setAddress(customer.getAddress());
        return existing;
    }

    @Override
    public String deleteCustomer(Long id) {
        Customer existing = getCustomerById(id);
        customers.remove(existing);
        return "Customer deleted with id: " + id;
    }
}


package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.service.ICustomer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@Tag(name = "Customer API", description = "CRUD operations for Customers")
public class CustomerController {

    @Autowired
    private ICustomer customerService;

    @Operation(summary = "Create a new customer")
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.addCustomer(customer);
    }

    @Operation(summary = "Get all customers")
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @Operation(summary = "Get customer by id")
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    @Operation(summary = "Update customer by id")
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return customerService.updateCustomer(id, customer);
    }

    @Operation(summary = "Delete customer by id")
    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable Long id) {
        return customerService.deleteCustomer(id);
    }
}
