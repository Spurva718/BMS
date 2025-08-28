package com.bank.main;

import com.bank.entity.Customer;
import com.bank.exception.BankException;
import com.bank.service.CustomerService;
import com.bank.service.CustomerServiceImpl;

import java.util.List;
import java.util.Scanner;

public class BankApplication {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        CustomerService service = new CustomerServiceImpl();

        while (true) {
            System.out.println("\n--- Customer Menu ---");
            System.out.println("1. Add Customer");
            System.out.println("2. View All Customers");
            System.out.println("3. Update Customer");
            System.out.println("4. Delete Customer");
            System.out.println("5. Exit");
            System.out.print("Choose: ");
            int choice = sc.nextInt();
            sc.nextLine();

            try {
                switch (choice) {
                    case 1:
                        System.out.print("Enter name: ");
                        String name = sc.nextLine();
                        System.out.print("Enter email: ");
                        String email = sc.nextLine();
                        Customer c = service.addCustomer(name, email);
                        System.out.println("Added: " + c);
                        break;
                    case 2:
                        List<Customer> customers = service.getAllCustomers();
                        customers.forEach(System.out::println);
                        break;
                    case 3:
                        System.out.print("Enter Customer ID to update: ");
                        int id = sc.nextInt();
                        sc.nextLine();
                        System.out.print("Enter new name: ");
                        String newName = sc.nextLine();
                        System.out.print("Enter new email: ");
                        String newEmail = sc.nextLine();
                        Customer updated = service.modifyCustomer(id, newName, newEmail);
                        System.out.println("Updated: " + updated);
                        break;
                    case 4:
                        System.out.print("Enter Customer ID to delete: ");
                        int deleteId = sc.nextInt();
                        boolean deleted = service.removeCustomer(deleteId);
                        System.out.println(deleted ? "Deleted successfully." : "Not found.");
                        break;
                    case 5:
                        System.exit(0);
                    default:
                        System.out.println("Invalid choice.");
                }
            } catch (BankException e) {
                System.err.println("Error: " + e.getMessage());
            }
        }
    }
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.BankException;
import com.bank.repository.CustomerRepository;

import java.util.List;

public class CustomerServiceImpl implements CustomerService {
    private CustomerRepository repo = new CustomerRepository();

    @Override
    public Customer addCustomer(String name, String email) throws BankException {
        try {
            Customer c = repo.insert(new Customer(name, email));
            if (c == null) throw new Exception("Insert failed");
            return c;
        } catch (Exception e) {
            throw new BankException("Unable to add customer", e);
        }
    }

    @Override
    public List<Customer> getAllCustomers() throws BankException {
        try {
            return repo.findAll();
        } catch (Exception e) {
            throw new BankException("Unable to fetch customers", e);
        }
    }

    @Override
    public Customer modifyCustomer(int id, String newName, String newEmail) throws BankException {
        try {
            Customer c = repo.update(id, newName, newEmail);
            if (c == null) throw new Exception("Update failed");
            return c;
        } catch (Exception e) {
            throw new BankException("Unable to update customer", e);
        }
    }

    @Override
    public boolean removeCustomer(int id) throws BankException {
        try {
            return repo.delete(id);
        } catch (Exception e) {
            throw new BankException("Unable to delete customer", e);
        }
    }
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.BankException;

import java.util.List;

public interface CustomerService {
    Customer addCustomer(String name, String email) throws BankException;
    List<Customer> getAllCustomers() throws BankException;
    Customer modifyCustomer(int id, String newName, String newEmail) throws BankException;
    boolean removeCustomer(int id) throws BankException;
}

package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.util.ConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CustomerRepository {

    public Customer insert(Customer customer) {
        String sql = "INSERT INTO customer (name, email) VALUES (?, ?) RETURNING customer_id, account_id";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Customer(
                        rs.getInt("customer_id"),
                        rs.getInt("account_id"),
                        customer.getName(),
                        customer.getEmail()
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Customer> findAll() {
        List<Customer> customers = new ArrayList<>();
        String sql = "SELECT * FROM customer";
        try (Connection con = ConnectionUtil.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                customers.add(new Customer(
                        rs.getInt("customer_id"),
                        rs.getInt("account_id"),
                        rs.getString("name"),
                        rs.getString("email")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return customers;
    }

    public Customer update(int customerId, String newName, String newEmail) {
        String sql = "UPDATE customer SET name = ?, email = ? WHERE customer_id = ? RETURNING *";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, newName);
            ps.setString(2, newEmail);
            ps.setInt(3, customerId);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Customer(
                        rs.getInt("customer_id"),
                        rs.getInt("account_id"),
                        rs.getString("name"),
                        rs.getString("email")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean delete(int customerId) {
        String sql = "DELETE FROM customer WHERE customer_id = ?";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, customerId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}

package com.bank.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionUtil {
    private static Connection con;

    private ConnectionUtil() {}

    public static Connection getConnection() throws SQLException {
        if (con == null || con.isClosed()) {
            con = DriverManager.getConnection(
                    "jdbc:postgresql://localhost:5432/bankdb",
                    "postgres", "your_password"
            );
        }
        return con;
    }
}

package com.bank.exception;

public class BankException extends Exception {
    public BankException(String message, Throwable cause) {
        super(message, cause);
    }
}

