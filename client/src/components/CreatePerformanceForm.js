import React, { useState } from 'react';
import axios from 'axios';

function CreatePerformanceForm() {
    const [score, setScore] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [gameId, setGameId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/performances', { score, player_id: playerId, game_id: gameId })
            .then(response => {
                console.log(response.data);
                setScore('');
                setPlayerId('');
                setGameId('');
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Score:
                <input type="text" value={score} onChange={(e) => setScore(e.target.value)} />
            </label>
            <label>
                Player ID:
                <input type="text" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
            </label>
            <label>
                Game ID:
                <input type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} />
            </label>
            <button type="submit">Create Performance</button>
        </form>
    );
}

export default CreatePerformanceForm;
