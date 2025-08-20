package com.bank.entity;

public class Customer {
    private int id;
    private String name;
    private String email;
    private String phone;

    // Constructors
    public Customer() {}

    public Customer(String name, String email, String phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public Customer(int id, String name, String email, String phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    @Override
    public String toString() {
        return "Customer{id=" + id + ", name='" + name + "', email='" + email + "', phone='" + phone + "'}";
    }
}


package com.bank.exception;

public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) {
        super(message);
    }
}


package com.bank.exception;

public class DataAccessException extends RuntimeException {
    public DataAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}


package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.exception.DataAccessException;
import com.bank.util.ConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CustomerRepository {

    public Customer save(Customer customer) {
        String sql = "INSERT INTO customers(name, email, phone) VALUES (?, ?, ?) RETURNING id";
        try (Connection con = ConnectionUtil.getInstance().getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                customer.setId(rs.getInt("id"));
            }
            return customer;

        } catch (SQLException e) {
            throw new DataAccessException("Error saving customer", e);
        }
    }

    public List<Customer> findAll() {
        String sql = "SELECT * FROM customers";
        List<Customer> list = new ArrayList<>();
        try (Connection con = ConnectionUtil.getInstance().getConnection();
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

    public Customer findById(int id) {
        String sql = "SELECT * FROM customers WHERE id = ?";
        try (Connection con = ConnectionUtil.getInstance().getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Customer(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone")
                );
            }
            return null;

        } catch (SQLException e) {
            throw new DataAccessException("Error finding customer by ID", e);
        }
    }

    public Customer update(int id, Customer customer) {
        String sql = "UPDATE customers SET name=?, email=?, phone=? WHERE id=? RETURNING id";
        try (Connection con = ConnectionUtil.getInstance().getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());
            ps.setInt(4, id);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                customer.setId(id);
                return customer;
            }
            return null;

        } catch (SQLException e) {
            throw new DataAccessException("Error updating customer", e);
        }
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM customers WHERE id = ?";
        try (Connection con = ConnectionUtil.getInstance().getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            throw new DataAccessException("Error deleting customer", e);
        }
    }
}


package com.bank.service;

import com.bank.entity.Customer;
import java.util.List;

public interface CustomerService {
    Customer addCustomer(Customer customer);
    List<Customer> getAllCustomers();
    Customer getCustomerById(int id);
    Customer updateCustomer(int id, Customer customer);
    boolean deleteCustomer(int id);
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.repository.CustomerRepository;

import java.util.List;

public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository = new CustomerRepository();

    @Override
    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    @Override
    public Customer getCustomerById(int id) {
        Customer customer = repository.findById(id);
        if (customer == null) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
        return customer;
    }

    @Override
    public Customer updateCustomer(int id, Customer customer) {
        Customer updated = repository.update(id, customer);
        if (updated == null) {
            throw new CustomerNotFoundException("Cannot update. Customer with id " + id + " not found");
        }
        return updated;
    }

    @Override
    public boolean deleteCustomer(int id) {
        return repository.delete(id);
    }
}

package com.bank.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionUtil {
    private static ConnectionUtil instance;
    private Connection connection;

    private ConnectionUtil() {}

    public static ConnectionUtil getInstance() {
        if (instance == null) {
            instance = new ConnectionUtil();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            String url = "jdbc:postgresql://localhost:5432/customer_db";
            String user = "postgres"; // your default superuser
            String password = "your_password_here"; // change this
            connection = DriverManager.getConnection(url, user, password);
        }
        return connection;
    }
}


package com.bank.main;

import com.bank.entity.Customer;
import com.bank.service.CustomerService;
import com.bank.service.CustomerServiceImpl;

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
            sc.nextLine(); // consume newline

            switch (choice) {
                case 1 -> {
                    System.out.print("Enter name: ");
                    String name = sc.nextLine();
                    System.out.print("Enter email: ");
                    String email = sc.nextLine();
                    System.out.print("Enter phone: ");
                    String phone = sc.nextLine();
                    Customer newCustomer = new Customer(name, email, phone);
                    System.out.println("✅ Added: " + service.addCustomer(newCustomer));
                }
                case 2 -> {
                    List<Customer> customers = service.getAllCustomers();
                    if (customers.isEmpty()) System.out.println("No customers found.");
                    else customers.forEach(System.out::println);
                }
                case 3 -> {
                    System.out.print("Enter ID: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    try {
                        System.out.println("Found: " + service.getCustomerById(id));
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
                        System.out.println("✅ Updated: " + service.updateCustomer(id, new Customer(name, email, phone)));
                    } catch (Exception e) {
                        System.out.println("⚠️ " + e.getMessage());
                    }
                }
                case 5 -> {
                    System.out.print("Enter ID to delete: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    boolean deleted = service.deleteCustomer(id);
                    System.out.println(deleted ? "✅ Deleted" : "⚠️ Not found");
                }
                case 0 -> {
                    System.out.println("Bye!");
                    return;
                }
                default -> System.out.println("Invalid choice");
            }
        }
    }
}

*** main
package com.bank.main;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;
import com.bank.service.CustomerService;
import com.bank.service.CustomerServiceImpl;

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
            sc.nextLine();

            try {
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
                        Customer c = service.getCustomerById(id);
                        System.out.println("Found: " + c);
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

                        Customer updated = service.updateCustomer(id, new Customer(name, email, phone));
                        System.out.println("✅ Updated: " + updated);
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
            } catch (CustomerNotFoundException e) {
                System.out.println("⚠️ Customer Not Found: " + e.getMessage());
            } catch (DataAccessException e) {
                System.out.println("⚠️ Database Error: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("⚠️ Unexpected Error: " + e.getMessage());
            }
        }
    }
}

service
package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;
import com.bank.repository.CustomerRepository;

import java.util.List;

public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository repo = new CustomerRepository();

    @Override
    public Customer addCustomer(Customer customer) {
        return repo.insert(customer);  // repo throws DataAccessException if DB issue
    }

    @Override
    public List<Customer> getAllCustomers() {
        return repo.findAll();  // repo throws DataAccessException if DB issue
    }

    @Override
    public Customer getCustomerById(int id) {
        Customer c = repo.findById(id);
        if (c == null) {
            throw new CustomerNotFoundException("No customer found with ID " + id);
        }
        return c;
    }

    @Override
    public Customer updateCustomer(int id, Customer updated) {
        Customer c = repo.findById(id);
        if (c == null) {
            throw new CustomerNotFoundException("Cannot update. No customer with ID " + id);
        }
        // If found → update
        updated.setId(id);
        return repo.update(updated);
    }

    @Override
    public boolean deleteCustomer(int id) {
        Customer c = repo.findById(id);
        if (c == null) {
            throw new CustomerNotFoundException("Cannot delete. No customer with ID " + id);
        }
        return repo.delete(id); // If DB fails, DataAccessException is thrown
    }
}

