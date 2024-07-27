import React from 'react';
import './Home.css'; // Import your CSS file for styling

const Home = ({ openClientForm, openFreelancerForm, openProjectForm }) => {
  return (
    <div className="home-container">
      <h2>Welcome to Freelancing Project Management</h2>
      <p>Manage your freelancers, clients, and projects all in one place.</p>
      <img src="/image.png" alt="Logo" className="cover-image" />
      <div className="button-group">
        <button className="action-button" onClick={openClientForm}>Add Client</button>
        <button className="action-button" onClick={openFreelancerForm}>Add Freelancer</button>
        <button className="action-button" onClick={openProjectForm}>Add Project</button>
      </div>
    </div>
  );
};

export default Home;
