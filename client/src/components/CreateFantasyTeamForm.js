import React, { useState } from 'react';
import axios from 'axios';

function CreateFantasyTeamForm() {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [position, setPosition] = useState('');
    const [teamId, setTeamId] = useState('');
    const [message, setMessage] = useState('');

    const handleTeamSubmit = (e) => {
        e.preventDefault();
        axios.post('/teams', { name, city })
            .then(response => {
                console.log(response.data);
                setMessage('Team created successfully!');
                // Reset form fields
                setName('');
                setCity('');
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to create team.');
            });
    };

    const handlePlayerSubmit = (e) => {
        e.preventDefault();
        axios.post('/players', { name, position, team_id: teamId })
            .then(response => {
                console.log(response.data);
                setMessage('Player created successfully!');
                // Reset form fields
                setName('');
                setPosition('');
                setTeamId('');
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to create player.');
            });
    };

    return (
        <div>
            <h2>Create Team</h2>
            <form onSubmit={handleTeamSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        City:
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <button type="submit">Create Team</button>
                </div>
            </form>

            <h2>Create Player</h2>
            <form onSubmit={handlePlayerSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Position:
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Team ID:
                        <input
                            type="text"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <button type="submit">Create Player</button>
                </div>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateFantasyTeamForm
