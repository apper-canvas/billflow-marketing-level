import invoicesData from '@/services/mockData/invoices.json';
import clientsData from '@/services/mockData/clients.json';

let invoices = [...invoicesData];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateInvoiceTotals(items, taxRate = 0, discountAmount = 0, discountType = 'fixed') {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const discount = discountType === 'percentage' 
    ? (subtotal * discountAmount) / 100 
    : discountAmount;
  const total = subtotal + taxAmount - discount;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    discountAmount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

const invoicesService = {
  async getAll() {
    await delay(500);
    return invoices.map(invoice => ({
      ...invoice,
      client: clientsData.find(c => c.Id === invoice.clientId)
    }));
  },

  async getById(id) {
    await delay(300);
    const invoice = invoices.find(inv => inv.Id === parseInt(id));
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return {
      ...invoice,
      client: clientsData.find(c => c.Id === invoice.clientId)
    };
  },

  async create(invoiceData) {
    await delay(500);
    
    const newId = Math.max(...invoices.map(inv => inv.Id), 0) + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(newId).padStart(4, '0')}`;
    
    const totals = calculateInvoiceTotals(
      invoiceData.items,
      invoiceData.taxRate || 0,
      invoiceData.discountAmount || 0,
      invoiceData.discountType || 'fixed'
    );
    
    const newInvoice = {
      Id: newId,
      invoiceNumber,
      clientId: invoiceData.clientId,
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      items: invoiceData.items,
      notes: invoiceData.notes || '',
      taxRate: invoiceData.taxRate || 0,
      discountAmount: invoiceData.discountAmount || 0,
      discountType: invoiceData.discountType || 'fixed',
      status: 'draft',
      ...totals,
      createdAt: new Date().toISOString()
    };
    
    invoices.push(newInvoice);
    return newInvoice;
  },

  async update(id, invoiceData) {
    await delay(500);
    
    const index = invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    const currentInvoice = invoices[index];
    if (currentInvoice.status !== 'draft') {
      throw new Error('Only draft invoices can be edited');
    }
    
    const totals = calculateInvoiceTotals(
      invoiceData.items,
      invoiceData.taxRate || 0,
      invoiceData.discountAmount || 0,
      invoiceData.discountType || 'fixed'
    );
    
    const updatedInvoice = {
      ...currentInvoice,
      clientId: invoiceData.clientId,
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      items: invoiceData.items,
      notes: invoiceData.notes || '',
      taxRate: invoiceData.taxRate || 0,
      discountAmount: invoiceData.discountAmount || 0,
      discountType: invoiceData.discountType || 'fixed',
      ...totals,
      updatedAt: new Date().toISOString()
    };
    
    invoices[index] = updatedInvoice;
    return updatedInvoice;
  },

  async delete(id) {
    await delay(300);
    const index = invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    const invoice = invoices[index];
    if (invoice.status !== 'draft') {
      throw new Error('Only draft invoices can be deleted');
    }
    
    invoices.splice(index, 1);
    return { success: true };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    const validStatuses = ['draft', 'sent', 'paid', 'overdue'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    invoices[index] = {
      ...invoices[index],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return invoices[index];
  },

  async getByClientId(clientId) {
    await delay(300);
    return invoices.filter(inv => inv.clientId === parseInt(clientId));
  }
};

export default invoicesService;