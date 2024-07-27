import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import FreelancerList from "./components/FreelancerList";
import ClientList from "./components/ClientList";
import ProjectList from "./components/ProjectList";
import ClientFormModal from "./components/ClientFormModal";
import FreelancerFormModal from "./components/FreelancerFormModal";
import ProjectFormModal from "./components/ProjectFormModal";
import Modal from 'react-modal';
import './index.css';  // Import global styles

Modal.setAppElement('#root');

function App() {
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isFreelancerFormOpen, setIsFreelancerFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  useEffect(() => {
    fetchFreelancers();
    fetchClients();
    fetchProjects();
  }, []);

  const fetchFreelancers = () => {
    fetch("/freelancers")
      .then(response => response.json())
      .then(data => setFreelancers(data))
      .catch(error => console.error('Error fetching freelancers:', error));
  };

  const fetchClients = () => {
    fetch("/clients")
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  };

  const fetchProjects = () => {
    fetch("/projects")
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  };

  const handleSuccess = () => {
    fetchFreelancers();
    fetchClients();
    fetchProjects();
  };

  return (
    <Router>
      <div>
        <header>
          <h1>Freelancing Project Management</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/freelancers">Freelancers</Link></li>
              <li><Link to="/clients">Clients</Link></li>
              <li><Link to="/projects">Projects</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Switch>
            <Route path="/" exact>
              <Home
                openClientForm={() => setIsClientFormOpen(true)}
                openFreelancerForm={() => setIsFreelancerFormOpen(true)}
                openProjectForm={() => setIsProjectFormOpen(true)}
              />
            </Route>
            <Route path="/freelancers">
              <FreelancerList 
                freelancers={freelancers} 
                openFreelancerForm={() => setIsFreelancerFormOpen(true)} 
                handleSuccess={handleSuccess} 
              />
            </Route>
            <Route path="/clients">
              <ClientList 
                clients={clients} 
                openClientForm={() => setIsClientFormOpen(true)} 
                handleSuccess={handleSuccess} 
              />
            </Route>
            <Route path="/projects">
              <ProjectList 
                projects={projects} 
                openProjectForm={() => setIsProjectFormOpen(true)} 
                handleSuccess={handleSuccess} 
              />
            </Route>
          </Switch>
        </main>
        <footer>
          <p>&copy; 2024 Freelancing Project Management</p>
        </footer>
        <ClientFormModal
          isOpen={isClientFormOpen}
          onRequestClose={() => setIsClientFormOpen(false)}
          onSuccess={handleSuccess}
        />
        <FreelancerFormModal
          isOpen={isFreelancerFormOpen}
          onRequestClose={() => setIsFreelancerFormOpen(false)}
          onSuccess={handleSuccess}
        />
        <ProjectFormModal
          isOpen={isProjectFormOpen}
          onRequestClose={() => setIsProjectFormOpen(false)}
          onSuccess={handleSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
