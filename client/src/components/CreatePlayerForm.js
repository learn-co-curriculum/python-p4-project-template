import React, { useState } from 'react';
import axios from 'axios';

function CreatePlayerForm() {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [teamId, setTeamId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/players', { name, position, team_id: teamId })
            .then(response => {
                console.log(response.data);
                setName('');
                setPosition('');
                setTeamId('');
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Position:
                <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
            </label>
            <label>
                Team ID:
                <input type="text" value={teamId} onChange={(e) => setTeamId(e.target.value)} />
            </label>
            <button type="submit">Create Player</button>
        </form>
    );
}

export default CreatePlayerForm;
