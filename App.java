package com.example.customerapp.entity; // Package for domain/entity classes
this.id = id; // Assign provided id
this.name = name; // Assign provided name
this.email = email; // Assign provided email
this.phone = phone; // Assign provided phone
}


public Customer(String name, String email, String phone) { // Constructor for inserts (no id yet)
this.name = name; // Assign name
this.email = email; // Assign email
this.phone = phone; // Assign phone
}


public int getId() { // Getter for id
return id; // Return id field
}


public void setId(int id) { // Setter for id (used after insert)
this.id = id; // Set id field
}


public String getName() { // Getter for name
return name; // Return name value
}


public void setName(String name) { // Setter for name
this.name = name; // Assign name
}


public String getEmail() { // Getter for email
return email; // Return email value
}


public void setEmail(String email) { // Setter for email
this.email = email; // Assign email
}


public String getPhone() { // Getter for phone
return phone; // Return phone value
}


public void setPhone(String phone) { // Setter for phone
this.phone = phone; // Assign phone
}


@Override
public String toString() { // Human-readable representation for prints/logs
return "Customer{" + // Begin string
"id=" + id + // Append id
", name='" + name + '\'' + // Append name with quotes
", email='" + email + '\'' + // Append email with quotes
", phone='" + phone + '\'' + // Append phone with quotes
'}'; // Close brace
}
}

***
package com.example.customerapp.exception; // Package for custom exceptions


public class CustomerNotFoundException extends RuntimeException { // Unchecked exception for not-found cases
public CustomerNotFoundException(String message) { // Constructor taking a message
super(message); // Pass message to RuntimeException
}
}
**
package com.example.customerapp.exception; // Same exceptions package


public class DataAccessException extends RuntimeException { // Wraps low-level SQL exceptions
public DataAccessException(String message, Throwable cause) { // Message + original cause
super(message, cause); // Delegate to RuntimeException
}
}
***
package com.example.customerapp.util; // Package for utilities


import java.sql.Connection; // JDBC Connection type
import java.sql.DriverManager; // For obtaining a connection
import java.sql.SQLException; // To handle connection errors


public class ConnectionUtil { // Class responsible for managing a single Connection
private static ConnectionUtil instance; // Holds the singleton instance
private Connection connection; // Holds the single DB connection


// Update these to match your pgAdmin setup
private static final String URL = "jdbc:postgresql://localhost:5432/customer_db"; // JDBC URL
private static final String USER = "customer_user"; // Database user
private static final String PASSWORD = "StrongPassword!123"; // Database password


private ConnectionUtil() { // Private constructor to prevent external instantiation
try { // Try to load driver + not strictly required on modern JDBC
Class.forName("org.postgresql.Driver"); // Explicitly load PostgreSQL driver (safe on all JDKs)
} catch (ClassNotFoundException e) { // If driver class not found
throw new RuntimeException("PostgreSQL JDBC driver not found in classpath.", e); // Fail fast
}
}


public static synchronized ConnectionUtil getInstance() { // Thread-safe access to singleton
if (instance == null) { // If no instance yet
instance = new ConnectionUtil(); // Create it
}
return instance; // Return the singleton
}


public synchronized Connection getConnection() { // Provides the single Connection instance
try { // Guard against SQL exceptions
if (connection == null || connection.isClosed()) { // If no connection or it was closed
connection = DriverManager.getConnection(URL, USER, PASSWORD); // Create a new connection
}
return connection; // Return existing/new connection
} catch (SQLException e) { // If opening connection fails
throw new RuntimeException("Unable to obtain DB connection", e); // Convert to unchecked
}
}


public synchronized void closeQuietly() { // Optional: close connection on app exit
if (connection != null) { // If a connection exists
try { // Attempt to close
connection.close(); // Close it
} catch (SQLException ignored) { // Ignore errors during close
}
}
}
}
***
package repository;

import entity.Customer;
import exception.DataAccessException;
import util.ConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CustomerRepository {

    // Insert customer
    public int insert(Customer customer) {
        String sql = "INSERT INTO customers(name, email, phone) VALUES (?, ?, ?) RETURNING id";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
            throw new DataAccessException("Failed to insert customer, no ID returned");

        } catch (SQLException e) {
            throw new DataAccessException("Error inserting customer", e);
        }
    }

    // Get all customers
    public List<Customer> findAll() {
        List<Customer> list = new ArrayList<>();
        String sql = "SELECT id, name, email, phone FROM customers";
        try (Connection con = ConnectionUtil.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                list.add(new Customer(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone")
                ));
            }
            return list;

        } catch (SQLException e) {
            throw new DataAccessException("Error fetching all customers", e);
        }
    }

    // Find customer by ID
    public Optional<Customer> findById(int id) {
        String sql = "SELECT id, name, email, phone FROM customers WHERE id = ?";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Customer(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getString("email"),
                            rs.getString("phone")
                    ));
                }
            }
            return Optional.empty();

        } catch (SQLException e) {
            throw new DataAccessException("Error finding customer by id", e);
        }
    }

    // Update customer
    public boolean update(int id, Customer updated) {
        String sql = "UPDATE customers SET name=?, email=?, phone=? WHERE id=?";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, updated.getName());
            ps.setString(2, updated.getEmail());
            ps.setString(3, updated.getPhone());
            ps.setInt(4, id);

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new DataAccessException("Error updating customer", e);
        }
    }

    // Delete customer
    public boolean delete(int id) {
        String sql = "DELETE FROM customers WHERE id=?";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new DataAccessException("Error deleting customer", e);
        }
    }
}
***
package service;

import entity.Customer;
import java.util.List;

public interface CustomerService {
    Customer addCustomer(Customer customer);
    List<Customer> getAllCustomers();
    Customer getCustomerById(int id);
    Customer updateCustomer(int id, Customer updated);
    boolean deleteCustomer(int id);
}
***
package service;

import entity.Customer;
import exception.CustomerNotFoundException;
import repository.CustomerRepository;

import java.util.List;

public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository repository = new CustomerRepository();

    @Override
    public Customer addCustomer(Customer customer) {
        int id = repository.insert(customer);
        customer.setId(id);
        return customer;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    @Override
    public Customer getCustomerById(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer id " + id + " not found"));
    }

    @Override
    public Customer updateCustomer(int id, Customer updated) {
        boolean ok = repository.update(id, updated);
        if (!ok) {
            throw new CustomerNotFoundException("Customer id " + id + " not found");
        }
        updated.setId(id);
        return updated;
    }

    @Override
    public boolean deleteCustomer(int id) {
        return repository.delete(id);
    }
}
***
package main;

import entity.Customer;
import service.CustomerService;
import service.CustomerServiceImpl;

import java.util.List;
import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        CustomerService service = new CustomerServiceImpl();

        while (true) {
            System.out.println("\n=== Customer CRUD Menu ===");
            System.out.println("1. Add Customer");
            System.out.println("2. List Customers");
            System.out.println("3. Get Customer by ID");
            System.out.println("4. Update Customer");
            System.out.println("5. Delete Customer");
            System.out.println("0. Exit");
            System.out.print("Enter choice: ");

            int choice = sc.nextInt();
            sc.nextLine(); // consume leftover newline

            switch (choice) {
                case 1 -> {
                    System.out.print("Enter name: ");
                    String name = sc.nextLine();
                    System.out.print("Enter email: ");
                    String email = sc.nextLine();
                    System.out.print("Enter phone: ");
                    String phone = sc.nextLine();

                    Customer newCustomer = new Customer(name, email, phone);
                    Customer saved = service.addCustomer(newCustomer);
                    System.out.println("✅ Added: " + saved);
                }
                case 2 -> {
                    List<Customer> customers = service.getAllCustomers();
                    if (customers.isEmpty()) {
                        System.out.println("No customers found.");
                    } else {
                        customers.forEach(System.out::println);
                    }
                }
                case 3 -> {
                    System.out.print("Enter ID: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    try {
                        Customer c = service.getCustomerById(id);
                        System.out.println("Found: " + c);
                    } catch (Exception e) {
                        System.out.println("⚠️ " + e.getMessage());
                    }
                }
                case 4 -> {
                    System.out.print("Enter ID to update: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    System.out.print("Enter new name: ");
                    String name = sc.nextLine();
                    System.out.print("Enter new email: ");
                    String email = sc.nextLine();
                    System.out.print("Enter new phone: ");
                    String phone = sc.nextLine();

                    try {
                        Customer updated = service.updateCustomer(id, new Customer(name, email, phone));
                        System.out.println("✅ Updated: " + updated);
                    } catch (Exception e) {
                        System.out.println("⚠️ " + e.getMessage());
                    }
                }
                case 5 -> {
                    System.out.print("Enter ID to delete: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    boolean deleted = service.deleteCustomer(id);
                    if (deleted) {
                        System.out.println("✅ Customer deleted");
                    } else {
                        System.out.println("⚠️ Customer not found");
                    }
                }
                case 0 -> {
                    System.out.println("Bye!");
                    return;
                }
                default -> System.out.println("Invalid choice, try again.");
            }
        }
    }
}


