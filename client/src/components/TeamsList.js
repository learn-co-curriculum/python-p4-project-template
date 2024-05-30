import Team from "./Teams";
import { useOutletContext } from "react-router-dom";

function TeamsList({ teams }) {
  console.log(teams);
  const teamsComponents = teams.map((team) => {
    return <Team key={team.id} team={team} />;
  });
  return <ul>{teamsComponents}</ul>;
}

export default TeamsList;
