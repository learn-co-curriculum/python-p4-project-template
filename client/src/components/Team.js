// import React from 'react'

// export default function Team() {
//   return (
//     <div>Team
//         use react router to get the team id.
//         Fetch data for 1 team (and get all games where they are a home team or an away team) and display games they played in with their scores
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Team() {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    // Fetch data for the team and their games
    fetchTeamData(teamId);
  }, [teamId]);

  const fetchTeamData = async (teamId) => {
    try {
      const teamResponse = await fetch(`/api/team/${teamId}`);
      const teamData = await teamResponse.json();
      setTeamData(teamData);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  return (
    <div>
      {teamData ? (
        <div>
          <h1>{teamData.name}</h1>
          <h2>Games</h2>
          <ul>
            {teamData.games.map(game => (
              <li key={game.id}>
                {game.homeTeam === teamData.id
                  ? `vs ${game.awayTeam} - ${game.homeTeamScore}-${game.awayTeamScore}`
                  : `@ ${game.homeTeam} - ${game.awayTeamScore}-${game.homeTeamScore}`}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Team;