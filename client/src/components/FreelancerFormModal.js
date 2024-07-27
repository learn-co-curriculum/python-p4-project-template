import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalForm.css';

const FreelancerFormModal = ({ isOpen, onRequestClose, onSuccess, initialData }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [rate, setRate] = useState('');
  const [error, setError] = useState(null);

  // useEffect to populate form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setUsername(initialData.username || '');
      setEmail(initialData.email || '');
      setRate(initialData.rate || '');
    } else {
      setName('');
      setUsername('');
      setEmail('');
      setRate('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFreelancer = { name, username, email, rate };

    try {
      let response;
      if (initialData) {
        // Update existing freelancer using PATCH
        response = await fetch(`/freelancers/${initialData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFreelancer),
        });
      } else {
        // Add new freelancer using POST
        response = await fetch('/freelancers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFreelancer),
        });
      }

      if (response.ok) {
        onSuccess();
        onRequestClose();
      } else {
        const errorData = await response.json();
        setError('Error ' + (initialData ? 'updating' : 'creating') + ' freelancer: ' + errorData.errors.join(', '));
      }
    } catch (error) {
      setError('Error ' + (initialData ? 'updating' : 'creating') + ' freelancer: ' + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={initialData ? 'Edit Freelancer' : 'Add Freelancer'}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Freelancer' : 'Add Freelancer'}</h2>
          <button onClick={onRequestClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Rate:
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onRequestClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {initialData ? 'Update Freelancer' : 'Add Freelancer'}
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </Modal>
  );
};

export default FreelancerFormModal;
