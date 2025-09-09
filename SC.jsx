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
