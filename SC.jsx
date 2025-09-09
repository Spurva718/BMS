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
