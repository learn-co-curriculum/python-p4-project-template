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
import NewGameForm from "./NewGame";
import "../index.css";

import ErrorPage from "./ErrorPage";
import Team from "./Team";

function App() {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);
    const [performances, setPerformances] = useState([]);
  

    const handleNewGame = (gameData) => {
        fetch("/games", {method: "POST"}).then(r =>r.json()).then(data => {
            setGames([...games, ])
        })
        
    }
  
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

    console.log(games)
  
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
            element: <CreateFantasyTeam players={players} />,
          },
          // {
          //   path: "/teams/team:id",
          //   element: <Team players={players} />,
          // },
          {
            path: "/games/new",
            element: <>
             <h1>Add a New Game</h1>
      <NewGameForm teams={teams} onSubmit={handleNewGame} />
      {/* <h2>Submitted Games</h2> */}
      {/* <ul>
        {games.map((game, index) => (
          <li key={index}>
            <p>Date: {game.date}</p>
            <p>Home Team: {game.home_team}</p>
            <p>Away Team: {game.away_team}</p>
            <p>Home Team Score: {game.home_team_score}</p>
            <p>Away Team Score: {game.away_team_score}</p>
          </li>
        ))}
      </ul> */}
            </>,
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
