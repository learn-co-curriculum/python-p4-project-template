// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Games() {
//     const [games, setGames] = useState([]);

//     useEffect(() => {
//     axios.get('/games').then(response => setGames(response.data));
//     }, []);

//     return (
//     <div>
//         <h2>Games</h2>
//         <ul>
//         {games.map(game => (
//             <li key={game.id}>{game.date} - {game.home_team} vs {game.away_team}</li>
//         ))}
//         </ul>
//     </div>
//     );
// }

// export default Games;
