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




import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ✅ Navbar
const Navbar = () => {
  return (
    <nav className="bg-[#002663] text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <img src="/scb-logo.png" alt="SCB Logo" className="h-8 w-8" />
        <span className="text-lg font-bold">Loan Origination System</span>
      </div>
      <div className="space-x-6">
        <a href="#" className="hover:underline">Maker Inbox</a>
        <a href="#" className="hover:underline">Checker Queue</a>
        <a href="#" className="hover:underline">Reports</a>
      </div>
      <button className="bg-white text-[#002663] px-4 py-1 rounded hover:bg-gray-100">
        Logout
      </button>
    </nav>
  );
};

// ✅ Reusable Button
const Btn = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm font-medium ${className}`}
  >
    {children}
  </button>
);

// ✅ Maker Inbox Table
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

  const [data] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // ✅ Sorting
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const order = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
  });

  // ✅ Filtering
  const filteredData = sortedData.filter((row) => {
    const textMatch = row.applicant.toLowerCase().includes(filterText.toLowerCase());
    const statusMatch = statusFilter === "ALL" || row.status === statusFilter;
    return textMatch && statusMatch;
  });

  // ✅ Pagination
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // ✅ Sorting Handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // ✅ Action Handlers
  const handleClaim = (ref) => alert(`Claimed ${ref}`);
  const handleUnclaim = (ref) => alert(`Unclaimed ${ref}`);
  const handleWorkItem = (ref) => alert(`Opened Work Item for ${ref}`);

  return (
    <div className="p-6">
      {/* 🔍 Search + Filter */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Applicant Name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
        </select>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-sm border border-gray-300">
          <thead className="bg-[#002663] text-white sticky top-0">
            <tr>
              {[
                { key: "ref", label: "Transaction Ref No" },
                { key: "loanId", label: "Loan ID" },
                { key: "applicant", label: "Applicant Name" },
                { key: "amount", label: "Amount" },
                { key: "currency", label: "Currency" },
                { key: "createdAt", label: "Created At" },
                { key: "currentStep", label: "Current Step" },
                { key: "lastStep", label: "Last Step Name" },
                { key: "processDate", label: "Process Date" },
                { key: "status", label: "Status" },
                { key: "assignedTo", label: "Assigned To" },
                { key: "openDocs", label: "Open Docs" },
                { key: "requiredLive", label: "Required Live" },
                { key: "reupload", label: "Re-upload" },
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
            {paginatedData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2">{row.ref}</td>
                <td className="px-4 py-2">{row.loanId}</td>
                <td className="px-4 py-2">{row.applicant}</td>
                <td className="px-4 py-2">{row.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{row.currency}</td>
                <td className="px-4 py-2">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{row.currentStep}</td>
                <td className="px-4 py-2">{row.lastStep}</td>
                <td className="px-4 py-2">{row.processDate}</td>
                <td className="px-4 py-2">{row.status}</td>
                <td className="px-4 py-2">{row.assignedTo}</td>
                <td className="px-4 py-2">{row.openDocs}</td>
                <td className="px-4 py-2">{row.requiredLive}</td>
                <td className="px-4 py-2">{row.reupload}</td>
                <td className="px-4 py-2 space-x-2">
                  <Btn className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleClaim(row.ref)}>Claim</Btn>
                  <Btn className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleUnclaim(row.ref)}>Unclaim</Btn>
                  <Btn className="bg-gray-200 hover:bg-gray-300"
                    onClick={() => handleWorkItem(row.ref)}>Go To Work Item</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📑 Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Btn
          className="bg-gray-200 hover:bg-gray-300"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Btn>
        <span>
          Page {page} of {totalPages}
        </span>
        <Btn
          className="bg-gray-200 hover:bg-gray-300"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Btn>
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
