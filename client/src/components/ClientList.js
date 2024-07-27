import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ClientList.css';
import ClientFormModal from './ClientFormModal'; // Assuming this is the correct file name for the ClientFormModal component

const ClientList = ({ clients, openClientForm, handleSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const openModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const handleAddClient = () => {
    openModal(null); // Open modal with null initialData to add a new client
  };

  const handleEditClient = (client) => {
    openModal(client); // Open modal with the selected client data to edit
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      fetch(`http://localhost:5555/clients/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            handleSuccess();
          } else {
            throw new Error('Failed to delete client');
          }
        })
        .catch(error => {
          console.error('Error deleting client:', error);
        });
    }
  };

  return (
    <div className="container">
      <h2>Clients</h2>
      <table className="client-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td data-label="Name">{client.name}</td>
              <td data-label="Username">{client.username}</td>
              <td data-label="Email">{client.email}</td>
              <td data-label="Action">
                <div className="action-buttons">
                  <button className="edit-button" onClick={() => handleEditClient(client)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteClient(client.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-client-button" onClick={handleAddClient}>Add Client</button>

      {/* ClientFormModal */}
      <ClientFormModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSuccess={handleSuccess}
        initialData={selectedClient}
      />
    </div>
  );
};

export default ClientList;
