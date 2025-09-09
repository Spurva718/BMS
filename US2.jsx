import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
  Chip,
  Paper,
  Collapse,
  IconButton,
  Slider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Stepper, Step, StepLabel } from "@mui/lab";

// Mock API (replace later with Spring Boot + PostgreSQL)
const fetchMakerInbox = async () => {
  return [
    {
      transactionRefNo: "TXN12345",
      loanId: "LN1001",
      applicantName: "John Doe",
      amount: 50000,
      currency: "USD",
      createdAt: "2025-09-08",
      currStep: "MAKER",
      lastStepName: "Initiated",
      processDate: "2025-09-09",
      status: "PENDING",
      assignedTo: null,
      openDocFlagsCount: 2,
      hasAllRequiredLive: false,
      reuploadRequestsToCustomer: true,
      flags: [
        {
          docFlagId: "DF101",
          documentCode: "PAN",
          reason_code: "MISSING",
          reason_text: "PAN document not uploaded",
          created_at: "2025-09-08",
        },
        {
          docFlagId: "DF102",
          documentCode: "SalarySlip",
          reason_code: "BLURRY",
          reason_text: "Salary slip is not clear",
          created_at: "2025-09-08",
        },
      ],
    },
    {
      transactionRefNo: "TXN67890",
      loanId: "LN2002",
      applicantName: "Jane Smith",
      amount: 100000,
      currency: "EUR",
      createdAt: "2025-09-07",
      currStep: "MAKER",
      lastStepName: "Submitted",
      processDate: "2025-09-08",
      status: "IN_PROGRESS",
      assignedTo: "Maker1",
      openDocFlagsCount: 0,
      hasAllRequiredLive: true,
      reuploadRequestsToCustomer: false,
      flags: [],
    },
  ];
};

const steps = ["Submitted", "Maker", "Checker", "Approved"];

export default function MakerInbox() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([0, 30]); // days
  const [amountRange, setAmountRange] = useState([0, 200000]);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    fetchMakerInbox().then(setRows);
  }, []);

  // Filtering logic
  const filteredRows = rows
    .filter(
      (row) =>
        row.applicantName.toLowerCase().includes(searchText.toLowerCase()) ||
        row.transactionRefNo.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((row) => (statusFilter ? row.status === statusFilter : true))
    .filter((row) => row.amount >= amountRange[0] && row.amount <= amountRange[1]);

  // DataGrid columns
  const columns = [
    {
      field: "expand",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() =>
            setOpenRow(openRow === params.row.transactionRefNo ? null : params.row.transactionRefNo)
          }
        >
          {openRow === params.row.transactionRefNo ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      ),
    },
    { field: "transactionRefNo", headerName: "Transaction Ref No", width: 180 },
    { field: "loanId", headerName: "Loan ID", width: 120 },
    { field: "applicantName", headerName: "Applicant", width: 160 },
    { field: "amount", headerName: "Amount", width: 120 },
    { field: "currency", headerName: "Currency", width: 120 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "currStep", headerName: "Current Step", width: 150 },
    { field: "lastStepName", headerName: "Last Step", width: 150 },
    { field: "processDate", headerName: "Process Date", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => <Chip label={params.value} color="warning" />,
    },
    { field: "assignedTo", headerName: "Assigned To", width: 150 },
    {
      field: "openDocFlagsCount",
      headerName: "Flags",
      width: 120,
      renderCell: (params) =>
        params.value > 0 ? <Chip label={`${params.value} Issues`} color="error" size="small" /> : null,
    },
    {
      field: "hasAllRequiredLive",
      headerName: "All Docs Live",
      width: 150,
      renderCell: (params) =>
        params.value ? <Chip label="Yes" color="success" /> : <Chip label="No" color="default" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button variant="outlined" size="small">
            View
          </Button>
          <Button
            variant="contained"
            color={params.row.assignedTo ? "secondary" : "primary"}
            size="small"
          >
            {params.row.assignedTo ? "Unclaim" : "Claim"}
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            disabled={!params.row.hasAllRequiredLive}
          >
            Go To Work Item
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box p={3}>
      {/* Workflow Stepper */}
      <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 5 }}>
        <Typography variant="h5" gutterBottom>
          Loan Workflow Progress
        </Typography>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 5 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Filters
        </Typography>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Search RefNo / Applicant"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          </TextField>
          <Box sx={{ width: 200 }}>
            <Typography variant="caption">Amount Range</Typography>
            <Slider
              value={amountRange}
              onChange={(e, newValue) => setAmountRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={200000}
              step={1000}
            />
          </Box>
        </Box>
      </Card>

      {/* Data Grid Table */}
      <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Maker Inbox
          </Typography>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.transactionRefNo}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expanded Row for Re-upload Flags */}
      {openRow && (
        <Collapse in={true} timeout="auto" unmountOnExit>
          <Box mt={2}>
            <Typography variant="h6">🔔 Re-upload Requests</Typography>
            {rows
              .find((r) => r.transactionRefNo === openRow)
              .flags.map((flag) => (
                <Paper
                  key={flag.docFlagId}
                  sx={{ p: 2, mb: 1, borderLeft: "5px solid red" }}
                >
                  <Typography>
                    <b>{flag.documentCode}</b> ({flag.reason_code}) – {flag.reason_text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Raised on {flag.created_at}
                  </Typography>
                </Paper>
              ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}



# Create project
npx create-react-app loan-origination-ui
cd loan-origination-ui

# Install UI dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-data-grid @mui/lab

# Start the project
npm start


import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn/ui
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-[#002663] text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-3">
        <img
          src="/scb-logo.png"
          alt="SCB Logo"
          className="h-8 w-8"
        />
        <span className="text-lg font-bold">Loan Origination System</span>
      </div>
      <div className="space-x-6">
        <a href="#" className="hover:underline">Maker Inbox</a>
        <a href="#" className="hover:underline">Checker Queue</a>
        <a href="#" className="hover:underline">Reports</a>
      </div>
      <Button variant="secondary" className="bg-white text-[#002663] hover:bg-gray-100">
        Logout
      </Button>
    </nav>
  );
};

// MakerInbox Table
const MakerInbox = () => {
  const initialData = [
    {
      ref: "SCW157SG10A1110419074465",
      loanId: "LN001",
      applicant: "John Doe",
      amount: 150000,
      currency: "USD",
      createdAt: "2019-04-11T14:08:04",
      currentStep: "MAKER",
      lastStep: "Loan Form",
      processDate: "2019-04-11",
      status: "PENDING",
      assignedTo: "Unassigned",
      openDocs: 2,
      requiredLive: "No",
      reupload: "Yes",
    },
    {
      ref: "SCW157SG10A1110419074466",
      loanId: "LN002",
      applicant: "Jane Smith",
      amount: 250000,
      currency: "USD",
      createdAt: "2019-04-11T14:08:10",
      currentStep: "MAKER",
      lastStep: "Loan Form",
      processDate: "2019-04-11",
      status: "IN_PROGRESS",
      assignedTo: "MakerUser1",
      openDocs: 0,
      requiredLive: "Yes",
      reupload: "No",
    },
  ];

  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState("");

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const order = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
  });

  // Filtering logic
  const filteredData = sortedData.filter((row) =>
    row.applicant.toLowerCase().includes(filter.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Action Handlers
  const handleClaim = (ref) => alert(`Claimed ${ref}`);
  const handleUnclaim = (ref) => alert(`Unclaimed ${ref}`);
  const handleWorkItem = (ref) => alert(`Opened Work Item for ${ref}`);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search by Applicant Name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-1/3"
        />
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-sm border border-gray-300">
          <thead className="bg-[#002663] text-white">
            <tr>
              {[
                { key: "ref", label: "Transaction Ref No" },
                { key: "loanId", label: "Loan ID" },
                { key: "applicant", label: "Applicant Name" },
                { key: "amount", label: "Amount" },
                { key: "currency", label: "Currency" },
                { key: "createdAt", label: "Created At" },
                { key: "status", label: "Status" },
                { key: "assignedTo", label: "Assigned To" },
                { key: "actions", label: "Actions" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => key !== "actions" && requestSort(key)}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortConfig.key === key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2">{row.ref}</td>
                <td className="px-4 py-2">{row.loanId}</td>
                <td className="px-4 py-2">{row.applicant}</td>
                <td className="px-4 py-2">{row.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{row.currency}</td>
                <td className="px-4 py-2">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">{row.status}</td>
                <td className="px-4 py-2">{row.assignedTo}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleClaim(row.ref)}>Claim</Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleUnclaim(row.ref)}>Unclaim</Button>
                  <Button size="sm" variant="secondary"
                    onClick={() => handleWorkItem(row.ref)}>Go To Work Item</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div>
      <Navbar />
      <MakerInbox />
    </div>
  );
}
