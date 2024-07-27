import React, { useState } from 'react';
import './ProjectList.css';
import ProjectFormModal from './ProjectFormModal'; // Import the ProjectFormModal component

const ProjectList = ({ projects, handleSuccess }) => {
  const [expandedProject, setExpandedProject] = useState(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      fetch(`/projects/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            handleSuccess();
          } else {
            throw new Error('Failed to delete project');
          }
        })
        .catch(error => {
          console.error('Error deleting project:', error);
        });
    }
  };

  const toggleProjectDetails = async (projectId) => {
    try {
      const response = await fetch(`/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      const data = await response.json();
      setExpandedProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const closeModal = () => {
    setExpandedProject(null);
  };

  return (
    <div className="container">
      <h2>Projects</h2>
      <table className="project-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Rate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td data-label="Title">{project.title}</td>
              <td data-label="Description">{project.description}</td>
              <td data-label="Rate">{project.rate}</td>
              <td data-label="Action">
                <div className="action-buttons">
                  <button className="view-button" onClick={() => toggleProjectDetails(project.id)}>View</button>
                  <button className="edit-button" onClick={() => handleEdit(project)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(project.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-project-button" onClick={() => setIsProjectFormOpen(true)}>Add Project</button>

      {expandedProject && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Project Details</h2>
            <p><strong>Title:</strong> {expandedProject.title}</p>
            <p><strong>Description:</strong> {expandedProject.description}</p>
            <p><strong>Rate:</strong> {expandedProject.rate}</p>
            <h3>Client Details:</h3>
            <p><strong>Name:</strong> {expandedProject.client.name}</p>
            <p><strong>Email:</strong> {expandedProject.client.email}</p>
            <h3>Freelancer Details:</h3>
            <p><strong>Name:</strong> {expandedProject.freelancer.name}</p>
            <p><strong>Email:</strong> {expandedProject.freelancer.email}</p>
          </div>
        </div>
      )}

      <ProjectFormModal
        isOpen={isProjectFormOpen}
        onRequestClose={() => { setIsProjectFormOpen(false); setEditingProject(null); }}
        onSuccess={handleSuccess}
        initialProject={editingProject}
      />
    </div>
  );
};

export default ProjectList;
