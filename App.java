package com.bank.app;

import com.bank.entity.*;
import com.bank.exceptions.*;
import com.bank.service.BankService;
import com.bank.service.impl.BankServiceImpl;

import java.util.List;
import java.util.Scanner;

/**
 * Console application (main) — it obtains user input, calls BankService methods,
 * and CATCHES exceptions thrown from service layer (propagation).
 *
 * This class demonstrates use-cases (1..7 menu), validation and printing.
 */
public class App {
    public static void main(String[] args) {
        BankService service = new BankServiceImpl();
        Scanner sc = new Scanner(System.in);

        boolean exit = false;
        while (!exit) {
            int choice = service.showMenu();  // non-void interface method
            try {
                switch (choice) {
                    case 1: // Add new account
                        System.out.print("Enter account type (Debit/Credit): ");
                        String type = sc.nextLine().trim();

                        System.out.print("Enter account number: ");
                        String accNum = sc.nextLine().trim();

                        System.out.print("Enter account owner: ");
                        String owner = sc.nextLine().trim();

                        System.out.print("Enter initial balance: ");
                        double balance = Double.parseDouble(sc.nextLine().trim());

                        if (type.equalsIgnoreCase("Debit")) {
                            System.out.print("Enter password: ");
                            String pwd = sc.nextLine().trim();
                            DebitAccount da = new DebitAccount(accNum, owner, balance, pwd);
                            service.addAccount(da);
                            System.out.println("Debit account has been successfully added!");
                        } else if (type.equalsIgnoreCase("Credit")) {
                            System.out.print("Enter limit: ");
                            double limit = Double.parseDouble(sc.nextLine().trim());
                            CreditAccount ca = new CreditAccount(accNum, owner, balance, limit);
                            service.addAccount(ca);
                            System.out.println("Credit account has been successfully added!");
                        } else {
                            System.out.println("Unknown account type. Use Debit or Credit.");
                        }
                        break;

                    case 2: // Display all accounts
                        List<Account> all = service.getAllAccounts();
                        System.out.println("All accounts:");
                        all.forEach(System.out::println); // uses toString()
                        break;

                    case 3: // Display account by ID
                        System.out.print("Please enter the account id: ");
                        String id = sc.nextLine().trim();
                        Account found = service.getAccountById(id);
                        System.out.println(found);
                        break;

                    case 4: // Perform payment
                        System.out.print("Please enter the account id: ");
                        String payId = sc.nextLine().trim();
                        System.out.print("Please enter the amount: ");
                        double payAmt = Double.parseDouble(sc.nextLine().trim());
                        Account payAcc = service.getAccountById(payId);
                        double newBal;
                        if (payAcc instanceof DebitAccount) {
                            System.out.print("Enter the password: ");
                            String pass = sc.nextLine().trim();
                            newBal = service.performPayment(payId, payAmt, pass); // overload with password
                        } else {
                            newBal = service.performPayment(payId, payAmt);
                        }
                        System.out.println("New balance: " + newBal);
                        break;

                    case 5: // Perform deposit
                        System.out.print("Please enter the account id: ");
                        String depId = sc.nextLine().trim();
                        System.out.print("Please enter the amount: ");
                        double depAmt = Double.parseDouble(sc.nextLine().trim());
                        Account depAcc = service.getAccountById(depId);
                        double afterBal;
                        if (depAcc instanceof DebitAccount) {
                            System.out.print("Enter the password: ");
                            String dpw = sc.nextLine().trim();
                            afterBal = service.performDeposit(depId, depAmt, dpw);
                        } else {
                            afterBal = service.performDeposit(depId, depAmt);
                        }
                        System.out.println("New balance: " + afterBal);
                        break;

                    case 6: // Delete selected account
                        System.out.print("Please enter the account id: ");
                        String delId = sc.nextLine().trim();
                        service.deleteAccount(delId);
                        System.out.println("Account has been deleted successfully!");
                        break;

                    case 7: // Exit
                        exit = true;
                        System.out.println("Exiting. Goodbye!");
                        break;

                    default:
                        System.out.println("Invalid choice, please try again.");
                }
            } catch (AccountNotFoundException | AuthenticationException |
                     InsufficientBalanceException | LimitExceededException |
                     DuplicateAccountException e) {
                System.err.println("Operation failed: " + e.getMessage());
            } catch (NumberFormatException nfe) {
                System.err.println("Invalid numeric input: " + nfe.getMessage());
            } catch (Exception e) {
                System.err.println("Unexpected error: " + e.getMessage());
            }
        }

        sc.close();
    }
}
