import React from "react";

function Home({ teams }) {
  return (
    <div>
      <h1>Teams</h1>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} ({team.city})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
