import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from '@/components/atoms/Container';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import clientsService from '@/services/api/clientsService';
import { cn } from '@/utils/cn';

function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('all');

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getAll();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, companyName) {
    if (window.confirm(`Are you sure you want to delete ${companyName}? This action cannot be undone.`)) {
      try {
        await clientsService.delete(id);
        setClients(prev => prev.filter(c => c.Id !== id));
        toast.success('Client deleted successfully');
      } catch (err) {
        toast.error('Failed to delete client');
      }
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterTerm === 'all' || 
      client.paymentTerms.netDays === parseInt(filterTerm);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClients} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <Container>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
              <p className="text-gray-600">Manage your client relationships and billing information</p>
            </div>
            <Button 
              onClick={() => navigate('/clients/new')}
              className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Plus" size={20} />
              <span className="ml-2">Add Client</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by company or contact name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">All Payment Terms</option>
              <option value="15">Net 15</option>
              <option value="30">Net 30</option>
              <option value="45">Net 45</option>
              <option value="60">Net 60</option>
            </select>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <Empty
            icon="Users"
            title="No clients found"
            message={searchTerm || filterTerm !== 'all' ? "Try adjusting your search or filter" : "Get started by adding your first client"}
            actionLabel={searchTerm || filterTerm !== 'all' ? undefined : "Add Client"}
            onAction={searchTerm || filterTerm !== 'all' ? undefined : () => navigate('/clients/new')}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Contact Person</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment Terms</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr 
                      key={client.Id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/clients/${client.Id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{client.companyName}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{client.contactPerson}</td>
                      <td className="px-6 py-4 text-gray-700">{client.email}</td>
                      <td className="px-6 py-4 text-gray-700">{client.phone}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Net {client.paymentTerms.netDays}
                        </span>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/clients/${client.Id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <ApperIcon name="Eye" size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/clients/edit/${client.Id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <ApperIcon name="Pencil" size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(client.Id, client.companyName)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <ApperIcon name="Trash2" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ClientsPage;