import React from 'react';

function PlayerForm({ addPlayer }) {
    const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const team_id = event.target.elements.team_id.value;
    addPlayer({ name, team_id });
    };

    return (
    <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Player name" />
        <input type="number" name="team_id" placeholder="Team ID" />
        <button type="submit">Add Player</button>
    </form>
    );
}

export default PlayerForm;