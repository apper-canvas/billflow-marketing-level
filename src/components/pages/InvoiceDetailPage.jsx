import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from '@/components/atoms/Container';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import invoicesService from '@/services/api/invoicesService';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { ApperClient } = window.ApperSDK || {};

  useEffect(() => {
    loadInvoice();
  }, [id]);

  async function loadInvoice() {
    try {
      setLoading(true);
      setError(null);
      const data = await invoicesService.getById(id);
      setInvoice(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    if (!ApperClient) {
      toast.error('SDK not initialized');
      return;
    }

    try {
      setActionLoading(true);
      
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_GENERATE_INVOICE_PDF,
        {
          body: JSON.stringify({ invoice }),
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (result.success === false) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_INVOICE_PDF}. The response body is: ${JSON.stringify(result)}.`);
        toast.error(result.message || 'Failed to generate PDF');
        return;
      }

      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${result.pdf}`;
      link.download = `${invoice.invoiceNumber}.pdf`;
      link.click();
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_GENERATE_INVOICE_PDF}. The error is: ${error.message}`);
      toast.error('Failed to download PDF');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!ApperClient) {
      toast.error('SDK not initialized');
      return;
    }

    if (!invoice.client?.email) {
      toast.error('Client email not found');
      return;
    }

    try {
      setActionLoading(true);
      
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_SEND_INVOICE_EMAIL,
        {
          body: JSON.stringify({ invoice }),
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (result.success === false) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_INVOICE_EMAIL}. The response body is: ${JSON.stringify(result)}.`);
        toast.error(result.message || 'Failed to send email');
        return;
      }

      if (invoice.status === 'draft') {
        await invoicesService.updateStatus(id, 'sent');
        loadInvoice();
      }
      
      toast.success('Invoice sent successfully');
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_INVOICE_EMAIL}. The error is: ${error.message}`);
      toast.error('Failed to send invoice');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateStatus(newStatus) {
    try {
      setActionLoading(true);
      await invoicesService.updateStatus(id, newStatus);
      toast.success('Invoice status updated');
      loadInvoice();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await invoicesService.delete(id);
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInvoice} />;
  if (!invoice) return <Error message="Invoice not found" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <Container>
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/invoices')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={24} />
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {invoice.invoiceNumber}
                </h1>
                <span className={cn(
                  'inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full',
                  getStatusColor(invoice.status)
                )}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadPDF}
                disabled={actionLoading}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Download" size={18} />
                Download PDF
              </Button>
              {invoice.status === 'draft' && (
                <Button
                  onClick={() => navigate(`/invoices/${id}/edit`)}
                  variant="outline"
                  size="sm"
                >
                  <ApperIcon name="Pencil" size={18} />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Client Details</h2>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-900">{invoice.client?.companyName}</p>
                  {invoice.client?.contactPerson && (
                    <p className="text-gray-600">{invoice.client.contactPerson}</p>
                  )}
                  {invoice.client?.email && (
                    <p className="text-gray-600">{invoice.client.email}</p>
                  )}
                  {invoice.client?.phone && (
                    <p className="text-gray-600">{invoice.client.phone}</p>
                  )}
                  {invoice.client?.billingAddress && (
                    <div className="text-gray-600 mt-2">
                      {invoice.client.billingAddress.street && <p>{invoice.client.billingAddress.street}</p>}
                      <p>
                        {[
                          invoice.client.billingAddress.city,
                          invoice.client.billingAddress.state,
                          invoice.client.billingAddress.zip
                        ].filter(Boolean).join(', ')}
                      </p>
                      {invoice.client.billingAddress.country && <p>{invoice.client.billingAddress.country}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Issue Date</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Due Date</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-full lg:w-1/2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">-${invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-300">
                <span>Total:</span>
                <span className="text-primary">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-end">
            {invoice.status === 'draft' && (
              <>
                <Button
                  onClick={handleSendEmail}
                  disabled={actionLoading || !invoice.client?.email}
                >
                  <ApperIcon name="Mail" size={18} />
                  Send to Client
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={18} />
                  Delete
                </Button>
              </>
            )}
            {invoice.status === 'sent' && (
              <>
                <Button
                  onClick={handleSendEmail}
                  disabled={actionLoading || !invoice.client?.email}
                  variant="outline"
                >
                  <ApperIcon name="Mail" size={18} />
                  Resend
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('paid')}
                  disabled={actionLoading}
                >
                  Mark as Paid
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('overdue')}
                  disabled={actionLoading}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                >
                  Mark as Overdue
                </Button>
              </>
            )}
            {invoice.status === 'overdue' && (
              <Button
                onClick={() => handleUpdateStatus('paid')}
                disabled={actionLoading}
              >
                Mark as Paid
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}