package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.exception.DataAccessException;
import com.bank.util.ConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CustomerRepository {

    public Customer insertCustomer(Customer customer) {
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
            return customer;

        } catch (SQLException e) {
            throw new DataAccessException("Error inserting customer", e);
        }
    }

    public Optional<Customer> getCustomerById(int accountId) {
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
            return Optional.empty();

        } catch (SQLException e) {
            throw new DataAccessException("Error fetching customer by ID", e);
        }
    }

    public List<Customer> getAllCustomers() {
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
            return list;

        } catch (SQLException e) {
            throw new DataAccessException("Error fetching all customers", e);
        }
    }

    public Customer updateCustomer(Customer customer) {
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
            return null;

        } catch (SQLException e) {
            throw new DataAccessException("Error updating customer", e);
        }
    }

    public boolean deleteCustomer(int accountId) {
        String sql = "DELETE FROM customer WHERE account_id=?";
        try (Connection con = ConnectionUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, accountId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new DataAccessException("Error deleting customer", e);
        }
    }
}

package com.bank.service;

import com.bank.entity.Customer;
import com.bank.exception.CustomerNotFoundException;
import com.bank.exception.DataAccessException;
import com.bank.repository.CustomerRepository;

import java.util.List;
import java.util.Optional;

public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repo = new CustomerRepository();

    @Override
    public Customer insertCustomer(Customer customer) throws DataAccessException {
        return repo.insertCustomer(customer);
    }

    @Override
    public Customer getCustomerById(int accountId) throws CustomerNotFoundException, DataAccessException {
        Optional<Customer> optional = repo.getCustomerById(accountId);
        return optional.orElseThrow(() ->
                new CustomerNotFoundException("Customer with Account ID " + accountId + " not found"));
    }

    @Override
    public List<Customer> getAllCustomers() throws DataAccessException {
        return repo.getAllCustomers();
    }

    @Override
    public Customer updateCustomer(Customer customer) throws CustomerNotFoundException, DataAccessException {
        Customer updated = repo.updateCustomer(customer);
        if (updated == null) {
            throw new CustomerNotFoundException("Customer not found for update");
        }
        return updated;
    }

    @Override
    public boolean deleteCustomer(int accountId) throws CustomerNotFoundException, DataAccessException {
        boolean deleted = repo.deleteCustomer(accountId);
        if (!deleted) {
            throw new CustomerNotFoundException("Customer not found for deletion");
        }
        return true;
    }
}
