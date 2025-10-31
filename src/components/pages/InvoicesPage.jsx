import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from '@/components/atoms/Container';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import invoicesService from '@/services/api/invoicesService';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      setLoading(true);
      setError(null);
      const data = await invoicesService.getAll();
      setInvoices(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, invoiceNumber) {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }

    try {
      await invoicesService.delete(id);
      toast.success('Invoice deleted successfully');
      loadInvoices();
    } catch (err) {
      toast.error(err.message || 'Failed to delete invoice');
    }
  }

  function getStatusColor(status) {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.draft;
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInvoices} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <Container>
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Invoices</h1>
              <p className="text-gray-600">Manage and track your invoices</p>
            </div>
            <Button onClick={() => navigate('/invoices/create')}>
              <ApperIcon name="Plus" size={20} />
              Create Invoice
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by invoice number or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {filteredInvoices.length === 0 ? (
            <Empty 
              message={searchTerm || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
              action={
                !searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => navigate('/invoices/create')}>
                    Create First Invoice
                  </Button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.Id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/invoices/${invoice.Id}`)}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          {invoice.invoiceNumber}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.client?.companyName || 'Unknown Client'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${(invoice.total || invoice.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          getStatusColor(invoice.status)
                        )}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/invoices/${invoice.Id}`)}
                            className="text-primary hover:text-primary/80 p-2 rounded-lg hover:bg-gray-100"
                            title="View"
                          >
                            <ApperIcon name="Eye" size={18} />
                          </button>
                          {invoice.status === 'draft' && (
                            <>
                              <button
                                onClick={() => navigate(`/invoices/${invoice.Id}/edit`)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-gray-100"
                                title="Edit"
                              >
                                <ApperIcon name="Pencil" size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(invoice.Id, invoice.invoiceNumber)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-gray-100"
                                title="Delete"
                              >
                                <ApperIcon name="Trash2" size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}