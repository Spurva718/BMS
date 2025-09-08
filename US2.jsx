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
