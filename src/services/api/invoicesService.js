import invoicesData from '@/services/mockData/invoices.json';

let invoices = [...invoicesData];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const invoicesService = {
  async getAll() {
    await delay(300);
    return invoices.map(invoice => ({ ...invoice }));
  },

  async getByClientId(clientId) {
    await delay(300);
    return invoices
      .filter(invoice => invoice.clientId === parseInt(clientId))
      .map(invoice => ({ ...invoice }));
  },

  async getById(id) {
    await delay(300);
    const invoice = invoices.find(inv => inv.Id === parseInt(id));
    return invoice ? { ...invoice } : null;
  }
};

export default invoicesService;