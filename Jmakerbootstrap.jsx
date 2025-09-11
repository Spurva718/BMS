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
  visibleColumns,
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
    <div className="table-responsive">
      <table className="table table-striped table-bordered shadow-sm">
        <thead className="text-white" style={{ backgroundColor: "#003366" }}>
          <tr>
            {columns
              .filter((col) => visibleColumns[col.key] !== false)
              .map((col) => (
                <th key={col.key} className="p-2">
                  {col.label}
                </th>
              ))}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                {columns
                  .filter((col) => visibleColumns[col.key] !== false)
                  .map((col) => (
                    <td key={col.key} className="align-middle">
                      {col.key === "openDocFlagsCount" ? (
                        row.flags.length > 0 ? "🚩" : ""
                      ) : col.key === "status" ? (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: statusColors[row.status]?.background,
                          }}
                        >
                          {row.status}
                        </span>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                <td className="align-middle">
                  <button
                    className="btn btn-sm text-white me-2"
                    style={{ backgroundColor: "#003366" }}
                    onClick={() => (window.location.href = "/details")}
                  >
                    View
                  </button>
                  {row.assignedTo ? (
                    <button
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: "red" }}
                      onClick={() => unclaim(row.id)}
                    >
                      Unclaim
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: "green" }}
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

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const statusColors = {
  IN_PROGRESS: { background: "blue" },
  PENDING: { background: "orange" },
  APPROVED: { background: "green" },
  REJECTED: { background: "red" },
};

import React from "react";

export default function ReuploadBanner({ flags, openDocFlagsCount }) {
  if ((!flags || flags.length === 0) && !openDocFlagsCount) return null;

  return (
    <div
      className="alert alert-warning mt-2 p-2 rounded"
      style={{ background: "#fff3cd", borderColor: "#ffeeba" }}
    >
      <strong>⚠️ Re-Checking required: </strong>
      {Array.isArray(flags) && flags.length > 0 ? (
        <ul className="mb-0 ps-3">
          {flags.map((f) => (
            <li key={f.docFlagId}>
              [{f.documentCode}] {f.reason_text} (
              {new Date(f.created_at).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-0">{openDocFlagsCount} document(s) need re-upload.</p>
      )}
    </div>
  );
}

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

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      !filters.searchText ||
      row.transactionRefNo
        .toLowerCase()
        .includes(filters.searchText.toLowerCase()) ||
      row.applicantName
        .toLowerCase()
        .includes(filters.searchText.toLowerCase());

    const matchesStatus = !filters.status || row.status === filters.status;

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
      <div className="container py-4">
        <div className="text-center mb-4">
          <h2 className="text-white fw-bold">Maker's Inbox</h2>
        </div>

        <div className="card shadow-lg rounded-3 border-0">
          <div
            className="card-header fw-bold fs-5"
            style={{ color: "#003366", borderBottom: "2px solid #eee" }}
          >
            Maker's Inbox : Transactions Overview
          </div>
          <div className="card-body">
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
    </div>
  );
}

import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="mb-3">
      {/* 🔹 Top row: search + show/hide columns */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search (txn, step, date...)"
          value={filters.searchText}
          onChange={(e) =>
            setFilters({ ...filters, searchText: e.target.value })
          }
        />

        <div className="position-relative">
          <button
            className="btn"
            style={{ background: "#003366", color: "white", borderRadius: "6px" }}
            onClick={() => setShowColumnsMenu(!showColumnsMenu)}
          >
            Show/Hide Columns
          </button>

          {showColumnsMenu && (
            <div
              className="dropdown-menu show p-2 shadow-sm"
              style={{ borderRadius: "6px" }}
            >
              {Object.keys(visibleColumns).map((colKey) => (
                <div key={colKey} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`col-${colKey}`}
                    checked={visibleColumns[colKey]}
                    onChange={() => toggleColumn(colKey)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`col-${colKey}`}
                  >
                    {colKey}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Bottom row: filters */}
      <div className="d-flex flex-wrap gap-2">
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <input
          type="number"
          className="form-control"
          placeholder="Min Amount"
          value={filters.minAmount}
          onChange={(e) =>
            setFilters({ ...filters, minAmount: e.target.value })
          }
        />

        <input
          type="number"
          className="form-control"
          placeholder="Max Amount"
          value={filters.maxAmount}
          onChange={(e) =>
            setFilters({ ...filters, maxAmount: e.target.value })
          }
        />

        <input
          type="date"
          className="form-control"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="form-control"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />

        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

import React from "react";
import logo from "../logo.png";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg px-3"
      style={{
        background: "linear-gradient(90deg, #003366, #004080)",
      }}
    >
      <div className="d-flex align-items-center">
        <img src={logo} alt="SC Logo" style={{ height: 34 }} className="me-2" />
        <span className="fw-bold fs-5 text-white">Maker Inbox</span>
      </div>

      <div className="ms-auto d-flex gap-3">
        <a href="/" className="nav-link text-white">
          English(UK)
        </a>
        <a href="/help" className="nav-link text-white">
          Contact Us
        </a>
        <a href="/help" className="nav-link text-white">
          More Services
        </a>
      </div>
    </nav>
  );
}

## changed MI 1

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
    <div className="mb-3">
      {/* Search + Show/Hide Columns */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search (txn, step, date...)"
          value={filters.searchText}
          onChange={(e) =>
            setFilters({ ...filters, searchText: e.target.value })
          }
        />

        <div className="position-relative">
          <button
            className="btn btn-dark btn-sm"
            onClick={() => setShowColumnsMenu(!showColumnsMenu)}
          >
            Show/Hide Columns
          </button>

          {showColumnsMenu && (
            <div className="position-absolute bg-white border rounded p-2 mt-1 shadow-sm">
              {Object.keys(visibleColumns).map((colKey) => (
                <div key={colKey} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={visibleColumns[colKey]}
                    onChange={() => toggleColumn(colKey)}
                    id={colKey}
                  />
                  <label
                    htmlFor={colKey}
                    className="form-check-label small text-muted"
                  >
                    {colKey}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters in Bootstrap Grid */}
      <div className="row g-2 mb-2">
        <div className="col-md-2 col-6">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="col-md-2 col-6">
          <input
            type="number"
            className="form-control"
            placeholder="Min Amount"
            value={filters.minAmount}
            onChange={(e) =>
              setFilters({ ...filters, minAmount: e.target.value })
            }
          />
        </div>

        <div className="col-md-2 col-6">
          <input
            type="number"
            className="form-control"
            placeholder="Max Amount"
            value={filters.maxAmount}
            onChange={(e) =>
              setFilters({ ...filters, maxAmount: e.target.value })
            }
          />
        </div>

        <div className="col-md-2 col-6">
          <input
            type="date"
            className="form-control"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        <div className="col-md-2 col-6">
          <input
            type="date"
            className="form-control"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>

        <div className="col-md-2 col-12">
          <button className="btn btn-secondary w-100" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
