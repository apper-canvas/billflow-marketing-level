import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@/components/atoms/Container';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import clientsService from '@/services/api/clientsService';
import invoicesService from '@/services/api/invoicesService';
import { format } from 'date-fns';

function ClientDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClientData();
  }, [id]);

  async function loadClientData() {
    try {
      setLoading(true);
      setError(null);
      const [clientData, invoiceData] = await Promise.all([
        clientsService.getById(id),
        invoicesService.getByClientId(id)
      ]);
      
      if (!clientData) {
        setError('Client not found');
        return;
      }
      
      setClient(clientData);
      setInvoices(invoiceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClientData} />;
  if (!client) return <Error message="Client not found" onRetry={() => navigate('/clients')} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <Container>
        <div className="mb-8">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center text-primary hover:text-secondary transition-colors mb-4"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span className="ml-2">Back to Clients</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.companyName}</h1>
              <p className="text-gray-600">Client Details and Transaction History</p>
            </div>
            <Button
              onClick={() => navigate(`/clients/edit/${client.Id}`)}
              className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Pencil" size={20} />
              <span className="ml-2">Edit Client</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ApperIcon name="User" size={24} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Person</label>
                <p className="text-gray-900 font-medium">{client.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{client.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{client.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="p-3 bg-green-100 rounded-lg">
                <ApperIcon name="MapPin" size={24} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Billing Address</h2>
            </div>
            <div className="space-y-2 text-gray-900">
              <p>{client.billingAddress.street}</p>
              <p>
                {client.billingAddress.city}, {client.billingAddress.state} {client.billingAddress.zip}
              </p>
              <p>{client.billingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ApperIcon name="CreditCard" size={24} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Terms</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Net Days</label>
                <p className="text-gray-900 font-medium">Net {client.paymentTerms.netDays}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Default Due Days</label>
                <p className="text-gray-900 font-medium">{client.paymentTerms.defaultDueDays} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ApperIcon name="FileText" size={24} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">
              {client.notes || 'No notes available'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-primary to-secondary">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ApperIcon name="Receipt" size={24} />
              Invoice History
            </h2>
          </div>
          
          {invoices.length === 0 ? (
            <div className="p-12 text-center">
              <ApperIcon name="Receipt" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No invoices found for this client</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Invoice Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Issue Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.Id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
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

export default ClientDetailPage;