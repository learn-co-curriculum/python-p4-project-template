import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "../components/NavBar";
import Home from "../components/Home";
import CreateFantasyTeam from "../components/CreateFantasyTeam";
import PlayerList from "./PlayerList";
import TeamDetails from "./TeamDetails";
import TeamsList from "./TeamsList";
import Layout from "./Layout";
import axios from "axios";
import "../index.css";
import Team from "./Team"

import ErrorPage from "./ErrorPage";
import CreateGameForm from "./CreateGameForm";

function App() {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);
    const [performances, setPerformances] = useState([]);
  
    useEffect(() => {
      axios.get("/teams").then((response) => {
        setTeams(response.data);
      });
      axios.get("/players").then((response) => setPlayers(response.data));
      axios.get("/games").then((response) => setGames(response.data));
      axios
       .get("/performances")
       .then((response) => setPerformances(response.data));
    }, []);
  
    const createFantasyTeam = (teamData) => {
      // Implement the logic to create a fantasy team here
      console.log("Creating fantasy team:", teamData);
    };
  
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: <Home teams={teams} />,
          },
          {
            path: "/teams",
            element: <TeamsList teams={teams || []} />,
          },
          {
            path: "/players",
            element: <PlayerList players={players || []} />,
          },
          {
            path: "/create-fantasy-team",
            element: <CreateFantasyTeam createFantasyTeams={createFantasyTeam} />,
          },
          ,
        {
          path: "/teams/:id",
          element: <Team/>
        },
        {path: "/games/new",
            element: <CreateGameForm teams={teams}/>
        }

        ],
      },
    ]);
  
    return (
      <div className="App">
        <RouterProvider router={router} />
      </div>
    );
  }

  export default App;
