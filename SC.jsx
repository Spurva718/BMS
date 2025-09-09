import React, { useState, useMemo } from 'react';
const MOCK_LOANS = [
  {
    transactionRefNo: 'SCW157SG10A1110419074465',
    loanId: 'LN001',
    applicantName: 'John Doe',
    amount: 150000,
    currency: 'USD',
    createdAt: '2019-04-11T08:38:04Z',
    currStep: 'MAKER',
    lastStepName: 'Loan Form',
    processDate: '2019-04-11',
    status: 'PENDING',
    assignedTo: null,
    openDocFlagsCount: 2,
    hasAllRequiredLive: false,
    reuploadRequestsToCustomer: true,
    documentFlags: [
      { docFlagId: 'DF001', documentCode: 'KYC', reason_code: 'EXP', reason_text: 'Expired ID', created_at: '2023-01-15' },
      { docFlagId: 'DF002', documentCode: 'INC', reason_code: 'MISS', reason_text: 'Missing Paystub', created_at: '2023-01-14' },
    ],
  },
  {
    transactionRefNo: 'SCW157SG10A1110419074466',
    loanId: 'LN002',
    applicantName: 'Jane Smith',
    amount: 250000,
    currency: 'USD',
    createdAt: '2019-04-11T08:38:10Z',
    currStep: 'MAKER',
    lastStepName: 'Loan Form',
    processDate: '2019-04-11',
    status: 'IN_PROGRESS',
    assignedTo: 'MakerUser1',
    openDocFlagsCount: 0,
    hasAllRequiredLive: true,
    reuploadRequestsToCustomer: false,
    documentFlags: [],
  },
  {
    transactionRefNo: 'SCW157SG10A1110419074467',
    loanId: 'LN003',
    applicantName: 'Peter Jones',
    amount: 75000,
    currency: 'EUR',
    createdAt: '2019-04-11T08:38:15Z',
    currStep: 'MAKER',
    lastStepName: 'Loan Form',
    processDate: '2019-04-11',
    status: 'PENDING',
    assignedTo: null,
    openDocFlagsCount: 1,
    hasAllRequiredLive: false,
    reuploadRequestsToCustomer: true,
    documentFlags: [
      { docFlagId: 'DF003', documentCode: 'ADDR', reason_code: 'UNC', reason_text: 'Unclear Address Proof', created_at: '2023-01-10' },
    ],
  },
  {
    transactionRefNo: 'SCW157SG10A1290419074509',
    loanId: 'LN004',
    applicantName: 'Alice Brown',
    amount: 300000,
    currency: 'GBP',
    createdAt: '2019-04-29T06:37:40Z',
    currStep: 'MAKER',
    lastStepName: 'Loan Form',
    processDate: '2019-04-29',
    status: 'IN_PROGRESS',
    assignedTo: 'MakerUser2',
    openDocFlagsCount: 0,
    hasAllRequiredLive: true,
    reuploadRequestsToCustomer: false,
    documentFlags: [],
  },
  {
    transactionRefNo: 'SCW157SG10A1290419074510',
    loanId: 'LN005',
    applicantName: 'Bob White',
    amount: 50000,
    currency: 'USD',
    createdAt: '2019-04-29T06:39:25Z',
    currStep: 'MAKER',
    lastStepName: 'Loan Form',
    processDate: '2019-04-29',
    status: 'PENDING',
    assignedTo: null,
    openDocFlagsCount: 0,
    hasAllRequiredLive: true,
    reuploadRequestsToCustomer: false,
    documentFlags: [],
  },
];
const MakerInboxTable = () => {
  const [loans] = useState(MOCK_LOANS); // Using static mock data
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showReuploadDetails, setShowReuploadDetails] = useState(false); // State for showing re-upload details

  // Filtered and sorted data based on UI parameters
  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      const matchesSearch = searchText === '' ||
                            loan.transactionRefNo.toLowerCase().includes(searchText.toLowerCase()) ||
                            loan.applicantName.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = statusFilter === '' || loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [loans, searchText, statusFilter]);

  // --- Placeholder functions for UI actions (no actual logic) ---
  const handleRowClick = (loanId, transactionRefNo) => {
    alert(`Row clicked: Loan ID - ${loanId}, Transaction Ref No - ${transactionRefNo}`);
    // In a real app, this would trigger navigation or a modal for details.
  };

  const handleClaimUnclaim = (transactionId, action) => {
    alert(`${action} action for Transaction ID: ${transactionId}`);
  };

  const handleGoToWorkItem = (transactionId, loanId) => {
    alert(`Go to Work Item for Transaction ID: ${transactionId}, Loan ID: ${loanId}`);
  };

  return (
    <div className="maker-inbox">
      <h1>Maker Inbox</h1>

      {/* Filters Section */}
      <div className="filters-section" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <input
          type="text"
          placeholder="Search RefNo/Applicant"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
        </select>
        {/* Placeholder for Date and Amount range filters */}
        <span>Date Range: <input type="date" /> to <input type="date" /></span>
        <span style={{ marginLeft: '10px' }}>Amount Range: <input type="number" placeholder="Min" /> to <input type="number" placeholder="Max" /></span>
        <button onClick={() => alert('Applying filters (no actual fetch)')} style={{ marginLeft: '10px', padding: '8px 12px' }}>Apply Filters</button>
      </div>

      {/* Re-upload Notifications/Banners */}
      {loans.some(loan => loan.reuploadRequestsToCustomer) && (
        <div className="reupload-banner" style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          <h3>Re-upload Requests Pending! <button onClick={() => setShowReuploadDetails(!showReuploadDetails)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>{showReuploadDetails ? 'Hide' : 'Show'} Details</button></h3>
          {showReuploadDetails && (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {loans.filter(loan => loan.reuploadRequestsToCustomer).map(loan => (
                <li key={loan.loanId} style={{ marginBottom: '5px', borderBottom: '1px dashed #ffeeba', paddingBottom: '5px' }}>
                  <strong>Loan {loan.loanId} ({loan.transactionRefNo})</strong> requires document re-uploads:
                  <ul style={{ listStyleType: 'circle', marginLeft: '20px' }}>
                    {loan.documentFlags.map(flag => (
                      <li key={flag.docFlagId}>
                        **{flag.documentCode}**: {flag.reason_text} (Reason: {flag.reason_code}, Created: {flag.created_at})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Loan Table */}
      <table className="loan-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={tableHeaderStyle}>Transaction Ref No</th>
            <th style={tableHeaderStyle}>Loan ID</th>
            <th style={tableHeaderStyle}>Applicant Name</th>
            <th style={tableHeaderStyle}>Amount</th>
            <th style={tableHeaderStyle}>Currency</th>
            <th style={tableHeaderStyle}>Created At</th>
            <th style={tableHeaderStyle}>Current Step</th>
            <th style={tableHeaderStyle}>Last Step Name</th>
            <th style={tableHeaderStyle}>Process Date</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Assigned To</th>
            <th style={tableHeaderStyle}>Open Docs</th>
            <th style={tableHeaderStyle}>Required Live</th>
            <th style={tableHeaderStyle}>Re-upload</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLoans.map((loan) => (
            <tr key={loan.transactionRefNo} onClick={() => handleRowClick(loan.loanId, loan.transactionRefNo)} style={tableRowStyle}>
              <td style={tableCellStyle}>{loan.transactionRefNo}</td>
              <td style={tableCellStyle}>{loan.loanId}</td>
              <td style={tableCellStyle}>{loan.applicantName}</td>
              <td style={tableCellStyle}>{loan.amount.toLocaleString()}</td>
              <td style={tableCellStyle}>{loan.currency}</td>
              <td style={tableCellStyle}>{new Date(loan.createdAt).toLocaleString()}</td>
              <td style={tableCellStyle}>{loan.currStep}</td>
              <td style={tableCellStyle}>{loan.lastStepName}</td>
              <td style={tableCellStyle}>{new Date(loan.processDate).toLocaleDateString()}</td>
              <td style={tableCellStyle}>{loan.status}</td>
              <td style={tableCellStyle}>{loan.assignedTo || 'Unassigned'}</td>
              <td style={tableCellStyle}>{loan.openDocFlagsCount}</td>
              <td style={tableCellStyle}>{loan.hasAllRequiredLive ? 'Yes' : 'No'}</td>
              <td style={tableCellStyle}>{loan.reuploadRequestsToCustomer ? 'Yes' : 'No'}</td>
              <td style={tableCellStyle}>
                <button onClick={(e) => { e.stopPropagation(); handleClaimUnclaim(loan.transactionRefNo, 'claim'); }} style={buttonStyle}>Claim</button>
                <button onClick={(e) => { e.stopPropagation(); handleClaimUnclaim(loan.transactionRefNo, 'unclaim'); }} style={buttonStyle}>Unclaim</button>
                <button onClick={(e) => { e.stopPropagation(); handleGoToWorkItem(loan.transactionRefNo, loan.loanId); }} style={buttonStyle}>Go to Work Item</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// Basic inline styles for demonstration
const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

const tableRowStyle = {
  cursor: 'pointer',
  
};

const buttonStyle = {
  marginRight: '5px',
  padding: '6px 10px',
  cursor: 'pointer',
};

export default MakerInboxTable;



import React, { useState, useMemo } from 'react';
import logo from './sc-logo.png'; // Add your Standard Chartered logo in /src folder

const MOCK_LOANS = [/* keep your mock loans as is */];

const MakerInboxTable = () => {
  const [loans] = useState(MOCK_LOANS);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showReuploadDetails, setShowReuploadDetails] = useState(false);

  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      const matchesSearch = searchText === '' ||
        loan.transactionRefNo.toLowerCase().includes(searchText.toLowerCase()) ||
        loan.applicantName.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === '' || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [loans, searchText, statusFilter]);

  const handleRowClick = (loanId, transactionRefNo) => {
    alert(`Row clicked: Loan ID - ${loanId}, Transaction Ref No - ${transactionRefNo}`);
  };

  const handleClaimUnclaim = (transactionId, action) => {
    alert(`${action} action for Transaction ID: ${transactionId}`);
  };

  const handleGoToWorkItem = (transactionId, loanId) => {
    alert(`Go to Work Item for Transaction ID: ${transactionId}, Loan ID: ${loanId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-blue-950 shadow-lg">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SC Logo" className="h-8" />
          <span className="text-white text-lg font-semibold">Standard Chartered</span>
        </div>
        <div className="text-white text-sm space-x-6">
          <span className="hover:underline cursor-pointer">English(UK)</span>
          <span className="hover:underline cursor-pointer">Contact Us</span>
          <span className="hover:underline cursor-pointer">More Services</span>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center text-white py-6">
        <h1 className="text-2xl font-bold">Maker Inbox</h1>
      </div>

      <div className="container mx-auto px-6">
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search RefNo/Applicant"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm">Date:</span>
            <input type="date" className="border rounded px-2 py-1" />
            <span>-</span>
            <input type="date" className="border rounded px-2 py-1" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Amount:</span>
            <input type="number" placeholder="Min" className="border rounded px-2 py-1 w-24" />
            <span>-</span>
            <input type="number" placeholder="Max" className="border rounded px-2 py-1 w-24" />
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
            Apply Filters
          </button>
        </div>

        {/* Re-upload Banner */}
        {loans.some(loan => loan.reuploadRequestsToCustomer) && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded shadow">
            <h3 className="font-semibold">
              Re-upload Requests Pending!
              <button
                onClick={() => setShowReuploadDetails(!showReuploadDetails)}
                className="ml-2 text-blue-600 underline"
              >
                {showReuploadDetails ? 'Hide' : 'Show'} Details
              </button>
            </h3>
            {showReuploadDetails && (
              <ul className="mt-2 space-y-2">
                {loans.filter(loan => loan.reuploadRequestsToCustomer).map(loan => (
                  <li key={loan.loanId} className="border-b pb-2">
                    <strong>{loan.loanId} ({loan.transactionRefNo})</strong> requires re-uploads:
                    <ul className="ml-6 list-disc text-sm">
                      {loan.documentFlags.map(flag => (
                        <li key={flag.docFlagId}>
                          {flag.documentCode}: {flag.reason_text} ({flag.reason_code}, {flag.created_at})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Loan Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full border-collapse">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Transaction Ref No</th>
                <th className="px-4 py-2 text-left">Loan ID</th>
                <th className="px-4 py-2 text-left">Applicant Name</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Currency</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Current Step</th>
                <th className="px-4 py-2 text-left">Last Step</th>
                <th className="px-4 py-2 text-left">Process Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Assigned To</th>
                <th className="px-4 py-2 text-left">Open Docs</th>
                <th className="px-4 py-2 text-left">Required Live</th>
                <th className="px-4 py-2 text-left">Re-upload</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan, idx) => (
                <tr
                  key={loan.transactionRefNo}
                  onClick={() => handleRowClick(loan.loanId, loan.transactionRefNo)}
                  className={`hover:bg-blue-50 cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-2">{loan.transactionRefNo}</td>
                  <td className="px-4 py-2">{loan.loanId}</td>
                  <td className="px-4 py-2">{loan.applicantName}</td>
                  <td className="px-4 py-2">{loan.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{loan.currency}</td>
                  <td className="px-4 py-2">{new Date(loan.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{loan.currStep}</td>
                  <td className="px-4 py-2">{loan.lastStepName}</td>
                  <td className="px-4 py-2">{new Date(loan.processDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{loan.status}</td>
                  <td className="px-4 py-2">{loan.assignedTo || 'Unassigned'}</td>
                  <td className="px-4 py-2">{loan.openDocFlagsCount}</td>
                  <td className="px-4 py-2">{loan.hasAllRequiredLive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{loan.reuploadRequestsToCustomer ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleClaimUnclaim(loan.transactionRefNo, 'claim'); }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Claim
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleClaimUnclaim(loan.transactionRefNo, 'unclaim'); }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Unclaim
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleGoToWorkItem(loan.transactionRefNo, loan.loanId); }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Go to Work Item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MakerInboxTable;

import React, { useEffect, useState } from "react";

// ------------------------------
// Utilities
// ------------------------------

const fmtMoney = (amt, currency) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amt);

const fmtDate = (iso) => new Date(iso).toLocaleString();

// ------------------------------
// Mock Data / API
// ------------------------------

const mockFlags = [
  {
    docFlagId: "F001",
    documentCode: "ID_PROOF",
    reason_code: "MISSING",
    reason_text: "ID proof not uploaded",
    created_at: new Date().toISOString(),
  },
  {
    docFlagId: "F002",
    documentCode: "ADDRESS_PROOF",
    reason_code: "BLURRY",
    reason_text: "Uploaded document is blurry",
    created_at: new Date().toISOString(),
  },
];

const mockRows = Array.from({ length: 10 }).map((_, i) => {
  const flagsCt = i % 3 === 0 ? Math.floor(Math.random() * 3) + 1 : 0;
  return {
    transactionId: `txn_${1000 + i}`,
    transactionRefNo: `SCW1575SG10A11${(10419074465 + i).toString()}`,
    loanId: `LN_${8000 + i}`,
    applicantName: i % 2 === 0 ? "Aarav Sharma" : "Sara Khan",
    amount: 50000 + i * 1275,
    currency: "USD",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    currStep: "MAKER",
    lastStepName: "Maker Completed",
    processDate: new Date(Date.now() - i * 3600000).toISOString(),
    status: i % 2 === 0 ? "PENDING" : "IN_PROGRESS",
    assignedTo: i % 4 === 0 ? null : "maker.user",
    openDocFlagsCount: flagsCt,
    hasAllRequiredLive: i % 5 !== 0,
    reuploadRequestsToCustomer: flagsCt > 0,
    flags: flagsCt > 0 ? mockFlags.slice(0, flagsCt) : [],
  };
});

const Api = {
  async listMakerQueue() {
    await new Promise((r) => setTimeout(r, 400));
    return JSON.parse(JSON.stringify(mockRows));
  },
  async claim(transactionId) {
    await new Promise((r) => setTimeout(r, 300));
  },
  async unclaim(transactionId) {
    await new Promise((r) => setTimeout(r, 300));
  },
};

// ------------------------------
// Main Component
// ------------------------------

export default function MakerInbox() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await Api.listMakerQueue();
      setRows(data);
      setLoading(false);
    })();
  }, []);

  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setMinAmount("");
    setMaxAmount("");
    setFromDate("");
    setToDate("");
  };

  const filtered = rows.filter((r) => {
    if (searchText) {
      const s = searchText.toLowerCase();
      if (
        !r.transactionRefNo.toLowerCase().includes(s) &&
        !r.applicantName.toLowerCase().includes(s)
      ) {
        return false;
      }
    }
    if (statusFilter && r.status !== statusFilter) return false;
    if (minAmount && r.amount < parseFloat(minAmount)) return false;
    if (maxAmount && r.amount > parseFloat(maxAmount)) return false;

    if (fromDate) {
      const from = new Date(fromDate);
      if (new Date(r.processDate) < from) return false;
    }
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      if (new Date(r.processDate) > to) return false;
    }

    return true;
  });

  const buttonStyle = {
    background: "#003366",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
  };

  const buttonSecondary = {
    background: "#666",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          background: "#003366",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="https://seeklogo.com/images/S/standard-chartered-bank-logo-2D1CF4A40B-seeklogo.com.png"
          alt="Logo"
          style={{ height: 30, marginRight: 15 }}
        />
        <h3 style={{ margin: 0 }}>Maker Inbox</h3>
      </div>

      <div style={{ padding: 20 }}>
        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search (RefNo / Applicant)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ padding: 6, flex: 1 }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: 6 }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            style={{ width: 120, padding: 6 }}
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            style={{ width: 120, padding: 6 }}
          />
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <button
            onClick={resetFilters}
            style={{ background: "#ccc", padding: "6px 12px", border: "none", cursor: "pointer" }}
          >
            Clear
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              background: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <thead style={{ background: "#003366", color: "white" }}>
              <tr>
                <th style={{ padding: 8, textAlign: "left" }}>Transaction Ref No</th>
                <th style={{ padding: 8 }}>Loan ID</th>
                <th style={{ padding: 8 }}>Applicant</th>
                <th style={{ padding: 8 }}>Amount</th>
                <th style={{ padding: 8 }}>Currency</th>
                <th style={{ padding: 8 }}>Created At</th>
                <th style={{ padding: 8 }}>Current Step</th>
                <th style={{ padding: 8 }}>Last Step</th>
                <th style={{ padding: 8 }}>Process Date</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Assigned To</th>
                <th style={{ padding: 8 }}>Flags</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <React.Fragment key={r.transactionId}>
                  <tr style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 6 }}>{r.transactionRefNo}</td>
                    <td style={{ padding: 6 }}>{r.loanId}</td>
                    <td style={{ padding: 6 }}>{r.applicantName}</td>
                    <td style={{ padding: 6 }}>{fmtMoney(r.amount, r.currency)}</td>
                    <td style={{ padding: 6 }}>{r.currency}</td>
                    <td style={{ padding: 6 }}>{fmtDate(r.createdAt)}</td>
                    <td style={{ padding: 6 }}>{r.currStep}</td>
                    <td style={{ padding: 6 }}>{r.lastStepName}</td>
                    <td style={{ padding: 6 }}>{fmtDate(r.processDate)}</td>
                    <td
                      style={{
                        padding: 6,
                        fontWeight: "bold",
                        color:
                          r.status === "PENDING"
                            ? "orange"
                            : r.status === "IN_PROGRESS"
                            ? "blue"
                            : r.status === "COMPLETED"
                            ? "green"
                            : "red",
                      }}
                    >
                      {r.status}
                    </td>
                    <td style={{ padding: 6 }}>{r.assignedTo || "Unassigned"}</td>
                    <td style={{ padding: 6 }}>
                      {r.openDocFlagsCount > 0 && (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          {r.openDocFlagsCount} ⚑
                        </span>
                      )}
                    </td>
                    <td style={{ padding: 6, display: "flex", gap: "4px" }}>
                      <button style={buttonSecondary}>View</button>
                      {r.assignedTo ? (
                        <button style={buttonStyle} onClick={() => Api.unclaim(r.transactionId)}>
                          Unclaim
                        </button>
                      ) : (
                        <button style={buttonStyle} onClick={() => Api.claim(r.transactionId)}>
                          Claim
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Re-upload Banner if flags exist */}
                  {r.openDocFlagsCount > 0 && (
                    <tr style={{ background: "#fff8e1" }}>
                      <td colSpan={13} style={{ padding: 10, fontSize: 14 }}>
                        <strong>Re-upload Required:</strong>
                        <ul style={{ marginTop: 5 }}>
                          {r.flags.map((f) => (
                            <li key={f.docFlagId}>
                              <b>{f.documentCode}</b> – {f.reason_text} ({fmtDate(f.created_at)})
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

##

import React, { useState, useEffect } from "react";

// Mock data with flags + re-upload examples
const mockTransactions = [
  {
    transactionRefNo: "TXN1001",
    loanId: "LN001",
    applicantName: "John Doe",
    amount: 50000,
    currency: "USD",
    createdAt: "2025-09-01",
    currStep: "MAKER",
    lastStepName: "INITIATED",
    processDate: "2025-09-02 14:10:00",
    status: "PENDING",
    assignedTo: null,
    openDocFlagsCount: 2,
    hasAllRequiredLive: false,
    reuploadRequestsToCustomer: true,
    flags: [
      {
        docFlagId: "F1",
        documentCode: "ID_PROOF",
        reason_code: "BLURRY",
        reason_text: "Uploaded ID proof is blurry",
        created_at: "2025-09-01",
      },
      {
        docFlagId: "F2",
        documentCode: "ADDRESS_PROOF",
        reason_code: "MISMATCH",
        reason_text: "Address does not match",
        created_at: "2025-09-01",
      },
    ],
  },
  {
    transactionRefNo: "TXN1002",
    loanId: "LN002",
    applicantName: "Alice Smith",
    amount: 75000,
    currency: "EUR",
    createdAt: "2025-09-01",
    currStep: "MAKER",
    lastStepName: "DOCS VERIFIED",
    processDate: "2025-09-03 09:00:00",
    status: "IN_PROGRESS",
    assignedTo: "user123",
    openDocFlagsCount: 0,
    hasAllRequiredLive: true,
    reuploadRequestsToCustomer: false,
    flags: [],
  },
];

export default function MakerInbox() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  useEffect(() => {
    setRows(mockTransactions);
  }, []);

  const filtered = rows.filter((r) => {
    if (search) {
      const s = search.toLowerCase();
      if (
        !r.transactionRefNo.toLowerCase().includes(s) &&
        !r.applicantName.toLowerCase().includes(s)
      )
        return false;
    }
    if (statusFilter && r.status !== statusFilter) return false;
    if (dateFrom && new Date(r.processDate) < new Date(dateFrom)) return false;
    if (dateTo && new Date(r.processDate) > new Date(dateTo)) return false;
    if (amountMin && r.amount < parseFloat(amountMin)) return false;
    if (amountMax && r.amount > parseFloat(amountMax)) return false;
    return true;
  });

  const claim = (txn) => {
    alert(`Claimed ${txn.transactionRefNo}`);
  };
  const unclaim = (txn) => {
    alert(`Unclaimed ${txn.transactionRefNo}`);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(180deg,#004080,#0066cc)",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#003366",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://seeklogo.com/images/S/standard-chartered-bank-logo-2D1CF4C08C-seeklogo.com.png"
            alt="SC Logo"
            style={{ height: 30, marginRight: 10 }}
          />
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            Maker Inbox
          </span>
        </div>
        <div>
          <span style={{ margin: "0 10px", cursor: "pointer" }}>English(UK)</span>
          <span style={{ margin: "0 10px", cursor: "pointer" }}>Contact Us</span>
          <span style={{ margin: "0 10px", cursor: "pointer" }}>
            More Services
          </span>
        </div>
      </div>

      {/* Content Card */}
      <div
        style={{
          background: "white",
          maxWidth: 1200,
          margin: "30px auto",
          borderRadius: 6,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          padding: 20,
        }}
      >
        {/* Search + Filters */}
        <div style={{ display: "flex", marginBottom: 15, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search (txn, applicant)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "6px 10px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          <button
            style={{
              marginLeft: 10,
              padding: "6px 12px",
              background: "#003366",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Show / Hide Columns
          </button>
        </div>

        {/* Extra filters row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "6px" }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Amount"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={amountMax}
            onChange={(e) => setAmountMax(e.target.value)}
          />
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setDateFrom("");
              setDateTo("");
              setAmountMin("");
              setAmountMax("");
            }}
            style={{
              padding: "6px 12px",
              background: "#888",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#003366", color: "white", textAlign: "left" }}>
              <th style={{ padding: "8px" }}>Transaction Ref No</th>
              <th>Loan ID</th>
              <th>Applicant</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Created At</th>
              <th>Curr Step</th>
              <th>Last Step</th>
              <th>Process Date</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <React.Fragment key={row.transactionRefNo}>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px", color: "#004080", fontWeight: "bold" }}>
                    {row.transactionRefNo}
                  </td>
                  <td>{row.loanId}</td>
                  <td>{row.applicantName}</td>
                  <td>{row.amount}</td>
                  <td>{row.currency}</td>
                  <td>{row.createdAt}</td>
                  <td>{row.currStep}</td>
                  <td>{row.lastStepName}</td>
                  <td>{row.processDate}</td>
                  <td
                    style={{
                      color:
                        row.status === "PENDING"
                          ? "orange"
                          : row.status === "IN_PROGRESS"
                          ? "blue"
                          : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {row.status}
                  </td>
                  <td>{row.assignedTo || "-"}</td>
                  <td>
                    {row.openDocFlagsCount > 0 ? (
                      <span
                        style={{
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px 6px",
                          fontSize: "12px",
                        }}
                      >
                        {row.openDocFlagsCount}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      style={{
                        marginRight: 5,
                        padding: "4px 8px",
                        background: "#003366",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    {row.assignedTo ? (
                      <button
                        onClick={() => unclaim(row)}
                        style={{
                          padding: "4px 8px",
                          background: "#999",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Unclaim
                      </button>
                    ) : (
                      <button
                        onClick={() => claim(row)}
                        style={{
                          padding: "4px 8px",
                          background: "green",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Claim
                      </button>
                    )}
                  </td>
                </tr>

                {/* Re-upload banner */}
                {row.flags && row.flags.length > 0 && (
                  <tr>
                    <td colSpan="13" style={{ background: "#fff3cd", padding: 8 }}>
                      <strong>Re-upload required:</strong>
                      <ul>
                        {row.flags.map((f) => (
                          <li key={f.docFlagId}>
                            {f.documentCode} - {f.reason_text}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
