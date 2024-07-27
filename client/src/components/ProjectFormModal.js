import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalForm.css';

const ProjectFormModal = ({ isOpen, onRequestClose, onSuccess, initialProject }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [clientId, setClientId] = useState('');
  const [error, setError] = useState(null);

  // useEffect to populate form fields when initialProject changes
  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title || '');
      setDescription(initialProject.description || '');
      setRate(initialProject.rate || '');
      setFreelancerId(initialProject.freelancer_id || '');
      setClientId(initialProject.client_id || '');
    } else {
      setTitle('');
      setDescription('');
      setRate('');
      setFreelancerId('');
      setClientId('');
    }
  }, [initialProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = { title, description, rate, freelancer_id: freelancerId, client_id: clientId };

    try {
      let response;
      if (initialProject) {
        // Update existing project using PATCH
        response = await fetch(`/projects/${initialProject.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProject),
        });
      } else {
        // Add new project using POST
        response = await fetch('/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProject),
        });
      }

      if (response.ok) {
        onSuccess();
        onRequestClose();
      } else {
        const errorData = await response.json();
        setError('Error ' + (initialProject ? 'updating' : 'creating') + ' project: ' + errorData.errors.join(', '));
      }
    } catch (error) {
      setError('Error ' + (initialProject ? 'updating' : 'creating') + ' project: ' + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={initialProject ? 'Edit Project' : 'Add Project'}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialProject ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onRequestClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            <label>
              Freelancer ID:
              <input
                type="number"
                value={freelancerId}
                onChange={(e) => setFreelancerId(e.target.value)}
                required
              />
            </label>
            <label>
              Client ID:
              <input
                type="number"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onRequestClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {initialProject ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </Modal>
  );
};

export default ProjectFormModal;
