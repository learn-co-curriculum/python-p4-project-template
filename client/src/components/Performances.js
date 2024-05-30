import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Performance() {
    const [performances, setPerformances] = useState([]);

    useEffect(() => {
    axios.get('/performances').then(response => setPerformances(response.data));
    }, []);

    return (
    <div>
        <h2>Performance</h2>
        <ul>
        {performances.map(performance => (
            <li key={performance.id}>{performance.player_name} - {performance.performance_metric}</li>
        ))}
        </ul>
    </div>
    );
}

export default Performance;
