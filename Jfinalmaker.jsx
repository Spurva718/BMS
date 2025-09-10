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


Navabar 2
import React from "react";
import logo from "../logo.png"; // make sure your logo.png is in src/

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <img src={logo} alt="Standard Chartered" style={styles.logo} />
      </div>
      <div style={styles.right}>
        <a href="#english" style={styles.link}>English(UK)</a>
        <a href="#contact" style={styles.link}>Contact Us</a>
        <a href="#services" style={styles.link}>More Services</a>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#003366",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 20px",
    borderBottom: "2px solid #002244",
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "36px",
  },
  right: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    position: "relative",
  },
};

import React from "react";
import Filters from "../components/Filters";
import TransactionTable from "../components/TransactionTable";

export default function MakerInbox() {
  return (
    <div style={styles.container}>
      {/* Page Header like Ops Checker Queue */}
      <div style={styles.header}>
        <h2 style={styles.title}>Maker's Inbox</h2>
      </div>

      {/* Center Card */}
      <div style={styles.card}>
        <Filters />
        <TransactionTable />
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#004080",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "95%",
    margin: "0 auto",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
};


Filters 2 

import React, { useState } from "react";

export default function Filters({
  filters,
  setFilters,
  clearFilters,
  visibleColumns,
  setVisibleColumns,
}) {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

  const toggleColumn = (colKey) => {
    setVisibleColumns({
      ...visibleColumns,
      [colKey]: !visibleColumns[colKey],
    });
  };

  return (
    <div style={styles.container}>
      {/* Top row: search + show/hide columns */}
      <div style={styles.topRow}>
        <input
          type="text"
          placeholder="Search (txn, step, date...)"
          value={filters.searchText}
          onChange={(e) =>
            setFilters({ ...filters, searchText: e.target.value })
          }
          style={styles.search}
        />
        <div style={{ position: "relative" }}>
          <button
            style={styles.button}
            onClick={() => setShowColumnsMenu(!showColumnsMenu)}
          >
            Show/Hide Columns
          </button>
          {showColumnsMenu && (
            <div style={styles.dropdownMenu}>
              {Object.keys(visibleColumns).map((colKey) => (
                <label key={colKey} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={visibleColumns[colKey]}
                    onChange={() => toggleColumn(colKey)}
                  />
                  {colKey}
                </label>
              ))}
            </div>
          )}
        </div>
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

        <button style={styles.clearBtn} onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { marginBottom: 15 },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  search: {
    flex: 1,
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    marginRight: 10,
  },
  button: {
    padding: "6px 12px",
    background: "#003366",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "white",
    border: "1px solid #ccc",
    padding: 10,
    borderRadius: 6,
    zIndex: 100,
  },
  checkboxLabel: {
    display: "block",
    fontSize: "14px",
    marginBottom: 4,
  },
  bottomRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  dropdown: { padding: "6px", borderRadius: 6, border: "1px solid #ccc" },
  input: { padding: "6px", borderRadius: 6, border: "1px solid #ccc" },
  clearBtn: {
    padding: "6px 12px",
    background: "gray",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import TransactionTable from "../components/TransactionTable";
import {
  fetchTransactionsFrontend,
  claimTransaction,
  unclaimTransaction,
} from "../api/transactionService";

export default function MakerInbox() {
  const [filters, setFilters] = useState({
    searchText: "",
    status: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  const [visibleColumns, setVisibleColumns] = useState({
    transactionRefNo: true,
    loanId: true,
    applicantName: true,
    amount: true,
    currency: true,
    createdAt: true,
    currStep: true,
    lastStepName: true,
    processDate: true,
    status: true,
    assignedTo: true,
    openDocFlagsCount: true,
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

  // 🔹 Apply filters here
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      !filters.searchText ||
      row.transactionRefNo
        .toLowerCase()
        .includes(filters.searchText.toLowerCase()) ||
      row.applicantName
        .toLowerCase()
        .includes(filters.searchText.toLowerCase());

    const matchesStatus =
      !filters.status || row.status === filters.status;

    const matchesAmount =
      (!filters.minAmount || row.amount >= Number(filters.minAmount)) &&
      (!filters.maxAmount || row.amount <= Number(filters.maxAmount));

    const matchesDate =
      (!filters.startDate ||
        new Date(row.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate ||
        new Date(row.createdAt) <= new Date(filters.endDate));

    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
  });

  const clearFilters = () =>
    setFilters({
      searchText: "",
      status: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
    });

  const claim = async (id) => {
    await claimTransaction(id);
  };
  const unclaim = async (id) => {
    await unclaimTransaction(id);
  };

  return (
    <div style={{ background: "#004080", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Maker's Inbox</h2>
        </div>
        <div style={styles.card}>
          <Filters
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
          <TransactionTable
            rows={filteredRows}
            claim={claim}
            unclaim={unclaim}
            page={page}
            setPage={setPage}
            total={total}
            pageSize={pageSize}
            visibleColumns={visibleColumns}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  header: { textAlign: "center", marginBottom: "20px" },
  title: { color: "white", fontSize: "22px", fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "95%",
    margin: "0 auto",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
};


import React from "react";

export default function ReuploadBanner({ flags, openDocFlagsCount }) {
  // If no flags at all, hide the banner
  if ((!flags || flags.length === 0) && !openDocFlagsCount) return null;

  return (
    <div style={styles.banner}>
      <strong>Re-upload required:</strong>
      {Array.isArray(flags) && flags.length > 0 ? (
        <ul>
          {flags.map((f) => (
            <li key={f.docFlagId}>
              [{f.documentCode}] {f.reason_text} (
              {new Date(f.created_at).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>{openDocFlagsCount} document(s) need re-upload.</p>
      )}
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

export default function TransactionTable({
  rows,
  claim,
  unclaim,
  page,
  setPage,
  total,
  pageSize,
  visibleColumns, // 🔹 control column visibility
}) {
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
            {columns
              .filter((col) => visibleColumns[col.key] !== false)
              .map((col) => (
                <th key={col.key} style={styles.th}>
                  {col.label}
                </th>
              ))}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                {columns
                  .filter((col) => visibleColumns[col.key] !== false)
                  .map((col) => (
                    <td key={col.key} style={styles.td}>
                      {col.key === "status" ? (
                        <span
                          style={{
                            ...styles.badge,
                            ...statusColors[row.status],
                          }}
                        >
                          {row.status}
                        </span>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                <td style={styles.td}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => (window.location.href = "/details")}
                  >
                    View
                  </button>
                  {row.assignedTo ? (
                    <button
                      style={styles.unclaimBtn}
                      onClick={() => unclaim(row.id)}
                    >
                      Unclaim
                    </button>
                  ) : (
                    <button
                      style={styles.claimBtn}
                      onClick={() => claim(row.id)}
                    >
                      Claim
                    </button>
                  )}
                </td>
              </tr>
              {/* Reupload Banner Row */}
              <tr>
                <td colSpan={columns.length + 1}>
                  <ReuploadBanner
                    flags={row.flags}
                    openDocFlagsCount={row.openDocFlagsCount}
                  />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  th: { background: "#003366", color: "white", padding: "8px" },
  td: { padding: "8px", borderBottom: "1px solid #ddd" },
  badge: {
    padding: "3px 6px",
    borderRadius: 4,
    fontSize: "0.8em",
    color: "white",
  },
  actionBtn: {
    marginRight: 5,
    padding: "4px 8px",
    background: "#003366",
    color: "white",
    border: "none",
    borderRadius: 4,
  },
  claimBtn: {
    padding: "4px 8px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: 4,
  },
  unclaimBtn: {
    padding: "4px 8px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: 4,
  },
  pagination: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },
};

const statusColors = {
  IN_PROGRESS: { background: "blue" },
  PENDING: { background: "orange" },
  APPROVED: { background: "green" },
  REJECTED: { background: "red" },
};
