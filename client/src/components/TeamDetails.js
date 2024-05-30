import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TeamDetails() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(() => {
    axios
        .get(`/teams/${id}`)
        .then((response) => {
        setTeam(response.data);
        setPlayers(response.data.players);
        setGames(response.data.games);
        })
        .catch((error) => console.error("Error fetching team details:", error));
    }, [id]);

    if (!team) return <div>Loading...</div>;

    return (
    <div>
        <h1>
        {team.name} ({team.city})
        </h1>
        <h2>Players</h2>
        <ul>
        {players.map((player) => (
            <li key={player.id}>
            {player.name} - {player.position}
            </li>
        ))}
        </ul>
        <h2>Games</h2>
        <ul>
        {games.map((game) => (
            <li key={game.id}>{game.date}</li>
        ))}
        </ul>
    </div>
    );
}

export default TeamDetails;
