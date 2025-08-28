CREATE TABLE customer (
    account_id SERIAL UNIQUE,
    customer_id SERIAL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    PRIMARY KEY (account_id)
);

-- Ensure IDs don’t start at 1
ALTER SEQUENCE customer_account_id_seq RESTART WITH 1000;
ALTER SEQUENCE customer_customer_id_seq RESTART WITH 5000;

package com.bank.entity;

public class Customer {
    private int accountId;   // Primary Key
    private int customerId;  // Unique
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

    // Getters and Setters
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
        return "Customer [accountId=" + accountId +
               ", customerId=" + customerId +
               ", name=" + name +
               ", email=" + email +
               ", phone=" + phone + "]";
    }
}

package com.bank.util;

import java.sql.*;

public class ConnectionUtil {
    private static Connection connection;

    private ConnectionUtil() {}

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(
                    "jdbc:postgresql://localhost:5432/customer_db",
                    "postgres",   // your username
                    "password"    // your password
            );
        }
        return connection;
    }

    // ✅ Reusable closing method
    public static void closeResources(ResultSet rs, Statement st, Connection con) {
        try { if (rs != null) rs.close(); } catch (Exception ignored) {}
        try { if (st != null) st.close(); } catch (Exception ignored) {}
        try { if (con != null) con.close(); } catch (Exception ignored) {}
    }
}

package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.util.ConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CustomerRepository {

    public void insertCustomer(Customer customer) throws SQLException {
        String sql = "INSERT INTO customer (name, email, phone) VALUES (?, ?, ?) RETURNING account_id, customer_id";
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            con = ConnectionUtil.getConnection();
            ps = con.prepareStatement(sql);
            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());

            rs = ps.executeQuery();
            if (rs.next()) {
                customer.setAccountId(rs.getInt("account_id"));
                customer.setCustomerId(rs.getInt("customer_id"));
            }
        } finally {
            ConnectionUtil.closeResources(rs, ps, con);
        }
    }

    public Customer getCustomerById(int accountId) throws SQLException {
        String sql = "SELECT * FROM customer WHERE account_id=?";
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            con = ConnectionUtil.getConnection();
            ps = con.prepareStatement(sql);
            ps.setInt(1, accountId);
            rs = ps.executeQuery();

            if (rs.next()) {
                return new Customer(
                        rs.getInt("account_id"),
                        rs.getInt("customer_id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone")
                );
            }
            return null; // Service layer decides what to do
        } finally {
            ConnectionUtil.closeResources(rs, ps, con);
        }
    }

    public List<Customer> getAllCustomers() throws SQLException {
        String sql = "SELECT * FROM customer";
        List<Customer> list = new ArrayList<>();
        Connection con = null;
        Statement st = null;
        ResultSet rs = null;

        try {
            con = ConnectionUtil.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sql);

            while (rs.next()) {
                list.add(new Customer(
                        rs.getInt("account_id"),
                        rs.getInt("customer_id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone")
                ));
            }
        } finally {
            ConnectionUtil.closeResources(rs, st, con);
        }
        return list;
    }

    public void updateCustomer(Customer customer) throws SQLException {
        String sql = "UPDATE customer SET name=?, email=?, phone=? WHERE account_id=?";
        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = ConnectionUtil.getConnection();
            ps = con.prepareStatement(sql);
            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());
            ps.setInt(4, customer.getAccountId());

            ps.executeUpdate();
        } finally {
            ConnectionUtil.closeResources(null, ps, con);
        }
    }

    public void deleteCustomer(int accountId) throws SQLException {
        String sql = "DELETE FROM customer WHERE account_id=?";
        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = ConnectionUtil.getConnection();
            ps = con.prepareStatement(sql);
            ps.setInt(1, accountId);
            ps.executeUpdate();
        } finally {
            ConnectionUtil.closeResources(null, ps, con);
        }
    }
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;

import java.util.List;

public interface CustomerService {
    Customer addCustomer(Customer customer) throws DataAccessException;
    Customer getCustomer(int accountId) throws CustomerNotFoundException, DataAccessException;
    List<Customer> getAllCustomers() throws DataAccessException;
    void updateCustomer(Customer customer) throws CustomerNotFoundException, DataAccessException;
    void deleteCustomer(int accountId) throws CustomerNotFoundException, DataAccessException;
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;
import com.bank.repository.CustomerRepository;

import java.sql.SQLException;
import java.util.List;

public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository repository = new CustomerRepository();

    @Override
    public Customer addCustomer(Customer customer) throws DataAccessException {
        try {
            repository.insertCustomer(customer);
            return customer;
        } catch (SQLException e) {
            throw new DataAccessException("Failed to insert customer", e);
        }
    }

    @Override
    public Customer getCustomer(int accountId) throws CustomerNotFoundException, DataAccessException {
        try {
            Customer customer = repository.getCustomerById(accountId);
            if (customer == null) {
                throw new CustomerNotFoundException("Customer with AccountId " + accountId + " not found");
            }
            return customer;
        } catch (SQLException e) {
            throw new DataAccessException("Failed to fetch customer", e);
        }
    }

    @Override
    public List<Customer> getAllCustomers() throws DataAccessException {
        try {
            return repository.getAllCustomers();
        } catch (SQLException e) {
            throw new DataAccessException("Failed to fetch all customers", e);
        }
    }

    @Override
    public void updateCustomer(Customer customer) throws CustomerNotFoundException, DataAccessException {
        try {
            Customer existing = repository.getCustomerById(customer.getAccountId());
            if (existing == null) {
                throw new CustomerNotFoundException("Customer with AccountId " + customer.getAccountId() + " not found for update");
            }
            repository.updateCustomer(customer);
        } catch (SQLException e) {
            throw new DataAccessException("Failed to update customer", e);
        }
    }

    @Override
    public void deleteCustomer(int accountId) throws CustomerNotFoundException, DataAccessException {
        try {
            Customer existing = repository.getCustomerById(accountId);
            if (existing == null) {
                throw new CustomerNotFoundException("Customer with AccountId " + accountId + " not found for deletion");
            }
            repository.deleteCustomer(accountId);
        } catch (SQLException e) {
            throw new DataAccessException("Failed to delete customer", e);
        }
    }
}

package com.bank.main;

import com.bank.entity.Customer;
import com.bank.exception.*;
import com.bank.service.CustomerService;
import com.bank.service.CustomerServiceImpl;

import java.util.List;
import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        CustomerService service = new CustomerServiceImpl();
        Scanner sc = new Scanner(System.in);

        try {
            while (true) {
                System.out.println("\n--- Customer Management ---");
                System.out.println("1. Add Customer");
                System.out.println("2. View Customer");
                System.out.println("3. View All Customers");
                System.out.println("4. Update Customer");
                System.out.println("5. Delete Customer");
                System.out.println("6. Exit");
                System.out.print("Enter choice: ");
                int choice = sc.nextInt();
                sc.nextLine();

                try {
                    switch (choice) {
                        case 1:
                            System.out.print("Enter Name: ");
                            String name = sc.nextLine();
                            if (name.trim().isEmpty()) throw new InvalidInputException("Name cannot be empty");

                            System.out.print("Enter Email: ");
                            String email = sc.nextLine();
                            if (!email.contains("@")) throw new InvalidInputException("Invalid email format");

                            System.out.print("Enter Phone: ");
                            String phone = sc.nextLine();
                            if (!phone.matches("\\d{10}")) throw new InvalidInputException("Phone must be 10 digits");

                            Customer newCustomer = new Customer();
                            newCustomer.setName(name);
                            newCustomer.setEmail(email);
                            newCustomer.setPhone(phone);

                            service.addCustomer(newCustomer);
                            System.out.println("✅ Customer added successfully: " + newCustomer);
                            break;

                        case 2:
                            System.out.print("Enter Account ID: ");
                            int id = sc.nextInt();
                            Customer customer = service.getCustomer(id);
                            System.out.println(customer);
                            break;

                        case 3:
                            List<Customer> customers = service.getAllCustomers();
                            customers.forEach(System.out::println);
                            break;

                        case 4:
                            System.out.print("Enter Account ID: ");
                            int updateId = sc.nextInt();
                            sc.nextLine();
                            System.out.print("Enter New Name: ");
                            String newName = sc.nextLine();
                            System.out.print("Enter New Email: ");
                            String newEmail = sc.nextLine();
                            System.out.print("Enter New Phone: ");
                            String newPhone = sc.nextLine();

                            Customer updateCustomer = new Customer(updateId, 0, newName, newEmail, newPhone);
                            service.updateCustomer(updateCustomer);
                            System.out.println("✅ Customer updated.");
                            break;

                        case 5:
                            System.out.print("Enter Account ID: ");
                            int deleteId = sc.nextInt();
                            service.deleteCustomer(deleteId);
                            System.out.println("✅ Customer deleted.");
                            break;

                        case 6:
                            System.out.println("👋 Exiting...");
                            return;

                        default:
                            throw new InvalidInputException("Invalid choice. Enter between 1-6.");
                    }
                } catch (InvalidInputException e) {
                    System.out.println("❌ Input Error: " + e.getMessage());
                } catch (CustomerNotFoundException e) {
                    System.out.println("❌ " + e.getMessage());
                } catch (DataAccessException e) {
                    System.out.println("❌ Database error: " + e.getMessage());
                } catch (Exception e) {
                    System.out.println("⚠️ Unexpected error: " + e.getMessage());
                }
            }
        } finally {
            sc.close();
        }
    }
}


*******
package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.util.ConnectionUtil;

import java.sql.*;
import java.util.Optional;

public class CustomerRepository {

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
                return Optional.empty(); // 🔹 no customer found
            }
        }
    }
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;
import com.bank.repository.CustomerRepository;

import java.sql.SQLException;
import java.util.Optional;

public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repo = new CustomerRepository();

    @Override
    public Customer getCustomerById(int accountId) throws CustomerNotFoundException, DataAccessException {
        try {
            Optional<Customer> optional = repo.getCustomerById(accountId);
            if (optional.isPresent()) {
                return optional.get();
            } else {
                throw new CustomerNotFoundException("Customer with Account ID " + accountId + " not found.");
            }
        } catch (SQLException e) {
            throw new DataAccessException("Error accessing database", e);
        }
    }

    // other methods (insert, update, delete, etc.) stay the same
}

try {
    System.out.print("Enter Account ID: ");
    int accountId = sc.nextInt();

    Customer customer = service.getCustomerById(accountId);
    System.out.println("✅ Customer Found: " + customer);

} catch (CustomerNotFoundException e) {
    System.out.println("❌ " + e.getMessage());
} catch (DataAccessException e) {
    System.out.println("❌ Database error: " + e.getMessage());
} catch (Exception e) {
    System.out.println("⚠️ Unexpected error: " + e.getMessage());
}





