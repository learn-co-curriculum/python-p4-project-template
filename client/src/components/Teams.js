import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Teams() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        axios.get('/teams').then(response => setTeams(response.data));
    }, []);

    return (
        <div>
            <h2>Teams</h2>
            <ul>
                {teams.map(team => (
                    <li key={team.id}>{team.name} ({team.city})</li>
                ))}
            </ul>
        </div>
    );
}

export default Teams;
