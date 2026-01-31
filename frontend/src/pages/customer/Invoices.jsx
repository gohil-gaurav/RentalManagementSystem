import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiFileText,
  FiDownload,
  FiSearch,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiEye,
  FiPrinter,
  FiMail,
  FiMoreVertical,
  FiDollarSign,
} from 'react-icons/fi';

// ============================================================================
// ENTERPRISE INVOICES PAGE - Clean SaaS Design
// ============================================================================

// Status Configuration
const statusConfig = {
  paid: {
    label: 'Paid',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: FiCheckCircle,
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: FiClock,
  },
  overdue: {
    label: 'Overdue',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: FiAlertCircle,
  },
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: FiFileText,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: FiAlertCircle,
  },
};

// Dummy Invoices Data
const dummyInvoices = [
  {
    _id: 'INV001',
    invoiceNumber: 'INV-2026-001',
    status: 'paid',
    createdAt: '2026-01-28T10:30:00Z',
    dueDate: '2026-02-07T10:30:00Z',
    paidAt: '2026-01-29T14:20:00Z',
    order: {
      _id: 'ORD001',
      orderNumber: 'ORD-2026-001',
    },
    items: [
      { name: 'Sony A7 IV Camera - 7 days', quantity: 1, price: 17500 },
      { name: 'Canon RF 70-200mm Lens - 7 days', quantity: 1, price: 12600 },
    ],
    subtotal: 30100,
    tax: 5418,
    total: 35518,
    paymentMethod: 'Credit Card (****4242)',
  },
  {
    _id: 'INV002',
    invoiceNumber: 'INV-2026-002',
    status: 'pending',
    createdAt: '2026-01-30T14:00:00Z',
    dueDate: '2026-02-09T14:00:00Z',
    order: {
      _id: 'ORD002',
      orderNumber: 'ORD-2026-002',
    },
    items: [
      { name: 'MacBook Pro 16" - 2 days', quantity: 1, price: 7000 },
    ],
    subtotal: 7000,
    tax: 1260,
    total: 8260,
    paymentMethod: null,
  },
  {
    _id: 'INV003',
    invoiceNumber: 'INV-2026-003',
    status: 'paid',
    createdAt: '2026-01-15T09:00:00Z',
    dueDate: '2026-01-25T09:00:00Z',
    paidAt: '2026-01-16T11:45:00Z',
    order: {
      _id: 'ORD003',
      orderNumber: 'ORD-2026-003',
    },
    items: [
      { name: 'DJI Mavic 3 Pro - 7 days', quantity: 1, price: 31500 },
    ],
    subtotal: 31500,
    tax: 5670,
    total: 37170,
    paymentMethod: 'UPI (john@upi)',
  },
  {
    _id: 'INV004',
    invoiceNumber: 'INV-2026-004',
    status: 'pending',
    createdAt: '2026-01-29T16:30:00Z',
    dueDate: '2026-02-08T16:30:00Z',
    order: {
      _id: 'ORD004',
      orderNumber: 'ORD-2026-004',
    },
    items: [
      { name: 'JBL PartyBox 710 - 7 days', quantity: 2, price: 28000 },
    ],
    subtotal: 28000,
    tax: 5040,
    total: 33040,
    paymentMethod: null,
  },
  {
    _id: 'INV005',
    invoiceNumber: 'INV-2026-005',
    status: 'overdue',
    createdAt: '2026-01-10T11:00:00Z',
    dueDate: '2026-01-20T11:00:00Z',
    order: {
      _id: 'ORD006',
      orderNumber: 'ORD-2026-006',
    },
    items: [
      { name: 'Projector Epson Pro - 3 days', quantity: 1, price: 6600 },
    ],
    subtotal: 6600,
    tax: 1188,
    total: 7788,
    paymentMethod: null,
  },
  {
    _id: 'INV006',
    invoiceNumber: 'INV-2026-006',
    status: 'paid',
    createdAt: '2026-01-05T08:00:00Z',
    dueDate: '2026-01-15T08:00:00Z',
    paidAt: '2026-01-06T09:30:00Z',
    order: {
      _id: 'ORD007',
      orderNumber: 'ORD-2026-007',
    },
    items: [
      { name: 'Herman Miller Aeron Chair - 30 days', quantity: 1, price: 18000 },
    ],
    subtotal: 18000,
    tax: 3240,
    total: 21240,
    paymentMethod: 'Net Banking (HDFC)',
  },
];

// Skeleton Components
const InvoiceRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-20" /></td>
    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
    <td className="px-4 py-4"><div className="h-6 bg-gray-100 rounded animate-pulse w-16" /></td>
    <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-20" /></td>
    <td className="px-4 py-4"><div className="h-8 bg-gray-100 rounded animate-pulse w-20" /></td>
  </tr>
);

// Format currency in INR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// Tab definitions
const tabs = [
  { id: 'all', label: 'All Invoices' },
  { id: 'pending', label: 'Pending' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
];

// Action Dropdown Component
const ActionDropdown = ({ invoice, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
      >
        <FiMoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            <button
              onClick={() => { onAction('view', invoice); setIsOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FiEye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => { onAction('download', invoice); setIsOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => { onAction('print', invoice); setIsOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => { onAction('email', invoice); setIsOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FiMail className="w-4 h-4" />
              Send via Email
            </button>
            {invoice.status === 'pending' && (
              <button
                onClick={() => { onAction('pay', invoice); setIsOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
              >
                <FiDollarSign className="w-4 h-4" />
                Pay Now
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Main Invoices Component
const Invoices = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use dummy invoices
  const invoices = dummyInvoices;

  // Filter invoices based on tab and search
  const filteredInvoices = invoices.filter((invoice) => {
    // Tab filter
    if (activeTab !== 'all' && invoice.status !== activeTab) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesInvoice = invoice.invoiceNumber?.toLowerCase().includes(query);
      const matchesOrder = invoice.order?.orderNumber?.toLowerCase().includes(query);
      if (!matchesInvoice && !matchesOrder) return false;
    }

    return true;
  });

  // Calculate stats
  const stats = {
    total: invoices.length,
    pending: invoices.filter((i) => i.status === 'pending').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.total || 0), 0),
    pendingAmount: invoices
      .filter((i) => i.status === 'pending' || i.status === 'overdue')
      .reduce((sum, i) => sum + (i.total || 0), 0),
  };

  const handleAction = (action, invoice) => {
    switch (action) {
      case 'view':
        console.log('View invoice:', invoice.invoiceNumber);
        break;
      case 'download':
        console.log('Download invoice:', invoice.invoiceNumber);
        break;
      case 'print':
        console.log('Print invoice:', invoice.invoiceNumber);
        break;
      case 'email':
        console.log('Email invoice:', invoice.invoiceNumber);
        break;
      case 'pay':
        console.log('Pay invoice:', invoice.invoiceNumber);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View and manage your billing history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-9 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <FiDownload className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Invoices</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Billed</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Paid</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{stats.paid}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Outstanding</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{formatCurrency(stats.pendingAmount)}</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.id === 'overdue' && stats.overdue > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                  {stats.overdue}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              className="w-full h-9 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-md 
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white"
            />
          </div>
          <span className="text-sm text-gray-500">
            {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        {isLoading ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array(5).fill(0).map((_, i) => <InvoiceRowSkeleton key={i} />)}
            </tbody>
          </table>
        ) : filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Invoice Number */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FiFileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</span>
                      </div>
                    </td>

                    {/* Order */}
                    <td className="px-4 py-4">
                      <Link
                        to={`/customer/orders/${invoice.order?._id}`}
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        {invoice.order?.orderNumber}
                      </Link>
                    </td>

                    {/* Issue Date */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{formatDate(invoice.createdAt)}</span>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${
                          invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-600'
                        }`}>
                          {formatDate(invoice.dueDate)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAction('download', invoice)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Download PDF"
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleAction('pay', invoice)}
                            className="ml-1 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                        <ActionDropdown invoice={invoice} onAction={handleAction} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <FiFileText className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-1">No invoices found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {activeTab !== 'all'
                ? `You don't have any ${activeTab} invoices`
                : searchQuery
                ? 'Try adjusting your search query'
                : "You don't have any invoices yet"}
            </p>
          </div>
        )}
      </div>

      {/* Payment Information */}
      {stats.pendingAmount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Outstanding Balance</h4>
              <p className="text-sm text-amber-700 mt-0.5">
                You have {formatCurrency(stats.pendingAmount)} in pending invoices. 
                Please clear your dues to avoid service interruption.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
