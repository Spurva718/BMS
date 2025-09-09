// Mock API service (frontend pagination now, backend ready later)

const mockTransactions = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  transactionRefNo: `TXN-${1000 + i}`,
  loanId: `LN-${2000 + i}`,
  applicantName: `Applicant ${i + 1}`,
  amount: (Math.random() * 100000).toFixed(2),
  currency: "USD",
  createdAt: new Date().toISOString().split("T")[0],
  currStep: "MAKER",
  lastStepName: "DOC_CHECK",
  processDate: new Date().toISOString().split("T")[0],
  status: ["PENDING", "IN_PROGRESS", "APPROVED", "REJECTED"][i % 4],
  assignedTo: i % 2 === 0 ? "user1" : null,
  openDocFlagsCount: i % 3 === 0 ? 2 : 0,
  hasAllRequiredLive: i % 4 !== 0,
  reuploadRequestsToCustomer: i % 3 === 0,
  flags: i % 3 === 0 ? [
    {
      docFlagId: i + 101,
      documentCode: "DOC123",
      reason_code: "MISSING",
      reason_text: "Missing signature",
      created_at: new Date().toISOString(),
    }
  ] : []
}));

// 🔹 Frontend pagination
export async function fetchTransactionsFrontend(page = 1, pageSize = 5) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    rows: mockTransactions.slice(start, end),
    total: mockTransactions.length,
  };
}

// 🔹 Backend pagination (to be used later with Spring Boot)
// export async function fetchTransactionsBackend(page = 1, size = 5, filters = {}) {
//   const query = new URLSearchParams({ page, size, ...filters });
//   const res = await fetch(`http://localhost:8080/api/transactions?${query}`);
//   return res.json();
// }

export async function claimTransaction(id) {
  console.log(`Claimed transaction ${id}`);
  // Backend later: await fetch(`http://localhost:8080/api/transactions/${id}/claim`, { method: "POST" });
}

export async function unclaimTransaction(id) {
  console.log(`Unclaimed transaction ${id}`);
  // Backend later: await fetch(`http://localhost:8080/api/transactions/${id}/unclaim`, { method: "POST" });
}

import React from "react";
import logo from "../logo.png";

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <img src={logo} alt="SC Logo" style={{ height: 34, marginRight: 12 }} />
        <span style={styles.title}>Maker Inbox</span>
      </div>
      <div style={styles.right}>
        <a href="/" style={styles.link}>Home</a>
        <a href="/help" style={styles.link}>Help</a>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "linear-gradient(90deg, #003366, #004080)",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  },
  left: { display: "flex", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
  right: { display: "flex", gap: "20px" },
  link: {
    color: "white",
    textDecoration: "none",
    position: "relative",
    padding: "4px",
  },
};

import React from "react";

export default function Filters({ filters, setFilters, clearFilters }) {
  return (
    <div style={styles.container}>
      {/* Top row: search + show/hide columns */}
      <div style={styles.topRow}>
        <input
          type="text"
          placeholder="Search (txn, step, date...)"
          value={filters.searchText}
          onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
          style={styles.search}
        />
        <button style={styles.button}>Show/Hide Columns</button>
      </div>

      {/* Bottom row: filters */}
      <div style={styles.bottomRow}>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={styles.dropdown}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <input
          type="number"
          placeholder="Min Amount"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={filters.maxAmount}
          onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
          style={styles.input}
        />

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          style={styles.input}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          style={styles.input}
        />

        <button style={styles.clearBtn} onClick={clearFilters}>Clear Filters</button>
      </div>
    </div>
  );
}

const styles = {
  container: { marginBottom: 15 },
  topRow: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  search: { flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" },
  button: { padding: "6px 12px", background: "#003366", color: "white", border: "none", borderRadius: 6 },
  bottomRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  dropdown: { padding: "6px", borderRadius: 6, border: "1px solid #ccc" },
  input: { padding: "6px", borderRadius: 6, border: "1px solid #ccc" },
  clearBtn: { padding: "6px 12px", background: "gray", color: "white", border: "none", borderRadius: 6 },
};

import React from "react";

export default function ReuploadBanner({ flags }) {
  if (!flags || flags.length === 0) return null;

  return (
    <div style={styles.banner}>
      <strong>Re-upload required:</strong>
      <ul>
        {flags.map((f) => (
          <li key={f.docFlagId}>
            [{f.documentCode}] {f.reason_text} ({new Date(f.created_at).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  banner: {
    marginTop: 8,
    background: "#fff3cd",
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ffeeba",
  },
};


import React from "react";
import ReuploadBanner from "./ReuploadBanner";

export default function TransactionTable({ rows, claim, unclaim, page, setPage, total, pageSize }) {
  const columns = [
    { key: "transactionRefNo", label: "Txn Ref" },
    { key: "loanId", label: "Loan ID" },
    { key: "applicantName", label: "Applicant" },
    { key: "amount", label: "Amount" },
    { key: "currency", label: "Currency" },
    { key: "createdAt", label: "Created" },
    { key: "currStep", label: "Step" },
    { key: "lastStepName", label: "Last Step" },
    { key: "processDate", label: "Process Date" },
    { key: "status", label: "Status" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "openDocFlagsCount", label: "Flags" },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={styles.th}>{col.label}</th>
            ))}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                {columns.map((col) => (
                  <td key={col.key} style={styles.td}>
                    {col.key === "status" ? (
                      <span style={{ ...styles.badge, ...statusColors[row.status] }}>
                        {row.status}
                      </span>
                    ) : row[col.key]}
                  </td>
                ))}
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => window.location.href="/details"}>View</button>
                  {row.assignedTo ? (
                    <button style={styles.unclaimBtn} onClick={() => unclaim(row.id)}>Unclaim</button>
                  ) : (
                    <button style={styles.claimBtn} onClick={() => claim(row.id)}>Claim</button>
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan={columns.length + 1}>
                  <ReuploadBanner flags={row.flags} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  th: { background: "#003366", color: "white", padding: "8px" },
  td: { padding: "8px", borderBottom: "1px solid #ddd" },
  badge: { padding: "3px 6px", borderRadius: 4, fontSize: "0.8em", color: "white" },
  actionBtn: { marginRight: 5, padding: "4px 8px", background: "#003366", color: "white", border: "none", borderRadius: 4 },
  claimBtn: { padding: "4px 8px", background: "green", color: "white", border: "none", borderRadius: 4 },
  unclaimBtn: { padding: "4px 8px", background: "red", color: "white", border: "none", borderRadius: 4 },
  pagination: { marginTop: 10, display: "flex", justifyContent: "center", gap: 10 },
};

const statusColors = {
  IN_PROGRESS: { background: "blue" },
  PENDING: { background: "orange" },
  APPROVED: { background: "green" },
  REJECTED: { background: "red" },
};


import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import TransactionTable from "../components/TransactionTable";
import { fetchTransactionsFrontend, claimTransaction, unclaimTransaction } from "../api/transactionService";

export default function MakerInbox() {
  const [filters, setFilters] = useState({
    searchText: "",
    status: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    fetchTransactionsFrontend(page, pageSize).then((res) => {
      setRows(res.rows);
      setTotal(res.total);
    });
  }, [page]);

  const clearFilters = () => setFilters({ searchText: "", status: "", minAmount: "", maxAmount: "", startDate: "", endDate: "" });

  const claim = async (id) => { await claimTransaction(id); };
  const unclaim = async (id) => { await unclaimTransaction(id); };

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <Filters filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
          <TransactionTable rows={rows} claim={claim} unclaim={unclaim} page={page} setPage={setPage} total={total} pageSize={pageSize} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", display: "flex", justifyContent: "center" },
  card: { background: "white", padding: "20px", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", width: "95%", maxWidth: "1400px" },
};


