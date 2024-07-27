import React, { useState } from 'react';
import './FreelancerList.css';
import FreelancerFormModal from './FreelancerFormModal';

const FreelancerList = ({ freelancers, openFreelancerForm, handleSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  const openModal = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFreelancer(null);
    setIsModalOpen(false);
  };

  const handleAddFreelancer = () => {
    openModal(null); // Open modal with null initialData to add a new freelancer
  };

  const handleEditFreelancer = (freelancer) => {
    openModal(freelancer); // Open modal with the selected freelancer data to edit
  };

  const handleDeleteFreelancer = (id) => {
    if (window.confirm('Are you sure you want to delete this freelancer?')) {
      fetch(`/freelancers/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            handleSuccess();
          } else {
            throw new Error('Failed to delete freelancer');
          }
        })
        .catch(error => {
          console.error('Error deleting freelancer:', error);
        });
    }
  };

  return (
    <div className="container">
      <h2>Freelancers</h2>
      <table className="freelancer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Rate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {freelancers.map(freelancer => (
            <tr key={freelancer.id}>
              <td data-label="Name">{freelancer.name}</td>
              <td data-label="Username">{freelancer.username}</td>
              <td data-label="Email">{freelancer.email}</td>
              <td data-label="Rate">{freelancer.rate}</td>
              <td data-label="Action">
                <div className="action-buttons">
                  <button className="edit-button" onClick={() => handleEditFreelancer(freelancer)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteFreelancer(freelancer.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-freelancer-button" onClick={handleAddFreelancer}>Add Freelancer</button>

      {/* FreelancerFormModal */}
      <FreelancerFormModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSuccess={handleSuccess}
        initialData={selectedFreelancer}
      />
    </div>
  );
};

export default FreelancerList;
