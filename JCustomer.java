CREATE TABLE Customer (
    account_id SERIAL PRIMARY KEY,
    customer_id SERIAL UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL
);

-- Ensure IDs don’t start at 1
ALTER SEQUENCE customer_account_id_seq RESTART WITH 1000;
ALTER SEQUENCE customer_customer_id_seq RESTART WITH 5000;


package com.bank.entity;

public class Customer {
    private int accountId;
    private int customerId;
    private String name;
    private String email;
    private String phone;

    public Customer() {}

    public Customer(int accountId, int customerId, String name, String email, String phone) {
        this.accountId = accountId;
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // Getters & Setters
    public int getAccountId() { return accountId; }
    public void setAccountId(int accountId) { this.accountId = accountId; }

    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    @Override
    public String toString() {
        return "Customer{" +
                "accountId=" + accountId +
                ", customerId=" + customerId +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}

package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.util.ConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CustomerRepository {

    public Customer insertCustomer(Customer customer) throws SQLException {
        String sql = "INSERT INTO customer (name, email, phone) VALUES (?, ?, ?) RETURNING account_id, customer_id";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    customer.setAccountId(rs.getInt("account_id"));
                    customer.setCustomerId(rs.getInt("customer_id"));
                }
            }
        }
        return customer;
    }

    public Optional<Customer> getCustomerById(int accountId) throws SQLException {
        String sql = "SELECT * FROM customer WHERE account_id=?";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, accountId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Customer(
                            rs.getInt("account_id"),
                            rs.getInt("customer_id"),
                            rs.getString("name"),
                            rs.getString("email"),
                            rs.getString("phone")
                    ));
                }
            }
        }
        return Optional.empty();
    }

    public List<Customer> getAllCustomers() throws SQLException {
        List<Customer> list = new ArrayList<>();
        String sql = "SELECT * FROM customer";
        try (Connection con = ConnectionUtil.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                list.add(new Customer(
                        rs.getInt("account_id"),
                        rs.getInt("customer_id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone")
                ));
            }
        }
        return list;
    }

    public Customer updateCustomer(Customer customer) throws SQLException {
        String sql = "UPDATE customer SET name=?, email=?, phone=? WHERE account_id=? RETURNING account_id, customer_id, name, email, phone";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());
            ps.setInt(4, customer.getAccountId());

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Customer(
                            rs.getInt("account_id"),
                            rs.getInt("customer_id"),
                            rs.getString("name"),
                            rs.getString("email"),
                            rs.getString("phone")
                    );
                }
            }
        }
        return customer;
    }

    public boolean deleteCustomer(int accountId) throws SQLException {
        String sql = "DELETE FROM customer WHERE account_id=?";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, accountId);
            return ps.executeUpdate() > 0;
        }
    }
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;

import java.util.List;

public interface CustomerService {
    Customer insertCustomer(Customer customer) throws DataAccessException;
    Customer getCustomerById(int accountId) throws CustomerNotFoundException, DataAccessException;
    List<Customer> getAllCustomers() throws DataAccessException;
    Customer updateCustomer(Customer customer) throws CustomerNotFoundException, DataAccessException;
    boolean deleteCustomer(int accountId) throws CustomerNotFoundException, DataAccessException;
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;
import com.bank.repository.CustomerRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repo = new CustomerRepository();

    @Override
    public Customer insertCustomer(Customer customer) throws DataAccessException {
        try {
            return repo.insertCustomer(customer);
        } catch (SQLException e) {
            throw new DataAccessException("Error inserting customer", e);
        }
    }

    @Override
    public Customer getCustomerById(int accountId) throws CustomerNotFoundException, DataAccessException {
        try {
            Optional<Customer> optional = repo.getCustomerById(accountId);
            return optional.orElseThrow(() -> 
                new CustomerNotFoundException("Customer with Account ID " + accountId + " not found"));
        } catch (SQLException e) {
            throw new DataAccessException("Error fetching customer", e);
        }
    }

    @Override
    public List<Customer> getAllCustomers() throws DataAccessException {
        try {
            return repo.getAllCustomers();
        } catch (SQLException e) {
            throw new DataAccessException("Error fetching all customers", e);
        }
    }

    @Override
    public Customer updateCustomer(Customer customer) throws CustomerNotFoundException, DataAccessException {
        try {
            Customer updated = repo.updateCustomer(customer);
            if (updated == null) {
                throw new CustomerNotFoundException("Customer not found for update");
            }
            return updated;
        } catch (SQLException e) {
            throw new DataAccessException("Error updating customer", e);
        }
    }

    @Override
    public boolean deleteCustomer(int accountId) throws CustomerNotFoundException, DataAccessException {
        try {
            boolean deleted = repo.deleteCustomer(accountId);
            if (!deleted) {
                throw new CustomerNotFoundException("Customer not found for deletion");
            }
            return true;
        } catch (SQLException e) {
            throw new DataAccessException("Error deleting customer", e);
        }
    }
}


package com.bank.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionUtil {
    private static final String URL = "jdbc:postgresql://localhost:5432/customer_db";
    private static final String USER = "customer_user";
    private static final String PASSWORD = "password";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}

package com.bank.main;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;
import com.bank.exception.InvalidInputException;
import com.bank.service.CustomerService;
import com.bank.service.CustomerServiceImpl;

import java.util.List;
import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        CustomerService service = new CustomerServiceImpl();

        try {
            while (true) {
                System.out.println("\n--- Customer Management ---");
                System.out.println("1. Insert Customer");
                System.out.println("2. Get Customer by ID");
                System.out.println("3. Get All Customers");
                System.out.println("4. Update Customer");
                System.out.println("5. Delete Customer");
                System.out.println("6. Exit");
                System.out.print("Enter choice: ");

                int choice = sc.nextInt();
                sc.nextLine();

                switch (choice) {
                    case 1:
                        System.out.print("Enter name: ");
                        String name = sc.nextLine();
                        System.out.print("Enter email: ");
                        String email = sc.nextLine();
                        System.out.print("Enter phone: ");
                        String phone = sc.nextLine();

                        Customer newCustomer = new Customer(0, 0, name, email, phone);
                        Customer inserted = service.insertCustomer(newCustomer);
                        System.out.println("✅ Inserted: " + inserted);
                        break;

                    case 2:
                        System.out.print("Enter Account ID: ");
                        int accountId = sc.nextInt();
                        Customer customer = service.getCustomerById(accountId);
                        System.out.println("✅ Found: " + customer);
                        break;

                    case 3:
                        List<Customer> customers = service.getAllCustomers();
                        customers.forEach(System.out::println);
                        break;

                    case 4:
                        System.out.print("Enter Account ID to update: ");
                        int updateId = sc.nextInt(); sc.nextLine();
                        System.out.print("Enter new name: ");
                        String newName = sc.nextLine();
                        System.out.print("Enter new email: ");
                        String newEmail = sc.nextLine();
                        System.out.print("Enter new phone: ");
                        String newPhone = sc.nextLine();

                        Customer updateCustomer = new Customer(updateId, 0, newName, newEmail, newPhone);
                        Customer updated = service.updateCustomer(updateCustomer);
                        System.out.println("✅ Updated: " + updated);
                        break;

                    case 5:
                        System.out.print("Enter Account ID to delete: ");
                        int deleteId = sc.nextInt();
                        boolean deleted = service.deleteCustomer(deleteId);
                        System.out.println("✅ Deleted: " + deleted);
                        break;

                    case 6:
                        System.out.println("Exiting...");
                        return;

                    default:
                        throw new InvalidInputException("Invalid menu choice!");
                }
            }
        } catch (InvalidInputException e) {
            System.out.println("❌ Input Error: " + e.getMessage());
        } catch (CustomerNotFoundException e) {
            System.out.println("❌ " + e.getMessage());
        } catch (DataAccessException e) {
            System.out.println("❌ Database Error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("⚠️ Unexpected Error: " + e.getMessage());
        } finally {
            sc.close();
        }
    }
}


    // ✅ Reusable closing method
    public static void closeResources(ResultSet rs, Statement st, Connection con) {
        try { if (rs != null) rs.close(); } catch (Exception ignored) {}
        try { if (st != null) st.close(); } catch (Exception ignored) {}
        try { if (con != null) con.close(); } catch (Exception ignored) {}
    }
}

