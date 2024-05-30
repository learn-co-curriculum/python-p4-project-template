import React, { useState } from 'react';
import axios from 'axios';

function CreateFantasyTeam({ players }) {
    const [teamName, setTeamName] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTeam = {
            name: teamName,
            players: selectedPlayers
        };
        // Adjust API endpoint and payload structure as needed
        await axios.post('/fantasy-teams', newTeam);
        setTeamName('');
        setSelectedPlayers([]);
    };

    const handlePlayerSelect = (playerId) => {
        setSelectedPlayers((prev) => [...prev, playerId]);
    };

    return (
        <div>
            <h1>Create Fantasy Team</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Team Name:</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Select Players:</label>
                    <ul>
                        {players && players.map(player => (
                            <li key={player.id}>
                                <input
                                    type="checkbox"
                                    value={player.id}
                                    onChange={() => handlePlayerSelect(player.id)}
                                />
                                {player.name} - {player.position}
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Create Team</button>
            </form>
        </div>
    );
}

export default CreateFantasyTeam;
