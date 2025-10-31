import clientsData from '@/services/mockData/clients.json';

let clients = [...clientsData];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const clientsService = {
  async getAll() {
    await delay(300);
    return clients.map(client => ({ ...client }));
  },

  async getById(id) {
    await delay(300);
    const client = clients.find(c => c.Id === parseInt(id));
    return client ? { ...client } : null;
  },

  async create(clientData) {
    await delay(300);
    const newClient = {
      ...clientData,
      Id: clients.length > 0 ? Math.max(...clients.map(c => c.Id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    return { ...newClient };
  },

  async update(id, clientData) {
    await delay(300);
    const index = clients.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Client not found');
    }
    clients[index] = {
      ...clients[index],
      ...clientData,
      Id: clients[index].Id,
      createdAt: clients[index].createdAt
    };
    return { ...clients[index] };
  },

  async delete(id) {
    await delay(300);
    const index = clients.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Client not found');
    }
    clients.splice(index, 1);
    return true;
  }
};

export default clientsService;