
// // src/NewGameForm.js
// import React, { useState } from 'react';


// const NewGameForm = ({ teams, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     date: '',
//     homeTeam: '',
//     awayTeam: '',
//     home_team_score: '',
//     away_team_score: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//     setFormData({
//       date: '',
//       homeTeamId: '',
//       awayTeamId: '',
//       home_team_score: '',
//       away_team_score: ''
//     });
//   };
  

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>
//           Date:
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Home Team:
//           <select value={formData.homeTeamId} onChange={handleChange}>
//                     {teams.map(team => {
//                         return <option value={team.id}>{team.name}</option>
//                     })}
//                 </select>
//         </label>
//       </div>
//       <div>
//         <label>
//           Away Team:
//           <select value={formData.awayTeamId} onChange={handleChange}>
//                     {teams.map(team => {
//                         return <option value={team.id}>{team.name}</option>
//                     })}
//                 </select>
//         </label>
//       </div>
//       <div>
//         <label>
//           Home Team Score:
//           <input
//             type="number"
//             name="home_team_score"
//             value={formData.home_team_score}
//             onChange={handleChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Away Team Score:
//           <input
//             type="number"
//             name="away_team_score"
//             value={formData.away_team_score}
//             onChange={handleChange}
//             required
//           />
//         </label>
//       </div>
//       <button type="submit">Add Game</button>
//     </form>
//   );
// };

// export default NewGameForm;

import React, { useState } from 'react';

function NewGame() {
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    homeTeamScore: '',
    awayTeamScore: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can perform actions like submitting the form data to a backend API
    // For now, let's just print the form data on the page
    console.log(formData);
  };

  return (
    <div>
      <h2>New Game Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Home Team:</label>
          <input type="text" name="homeTeam" value={formData.homeTeam} onChange={handleChange} />
        </div>
        <div>
          <label>Away Team:</label>
          <input type="text" name="awayTeam" value={formData.awayTeam} onChange={handleChange} />
        </div>
        <div>
          <label>Home Team Score:</label>
          <input type="number" name="homeTeamScore" value={formData.homeTeamScore} onChange={handleChange} />
        </div>
        <div>
          <label>Away Team Score:</label>
          <input type="number" name="awayTeamScore" value={formData.awayTeamScore} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>

      {formData.homeTeam && formData.awayTeam && formData.homeTeamScore && formData.awayTeamScore && (
        <div>
          <h2>Submitted Games</h2>
          <p>Home Team: {formData.homeTeam}</p>
          <p>Away Team: {formData.awayTeam}</p>
          <p>Home Team Score: {formData.homeTeamScore}</p>
          <p>Away Team Score: {formData.awayTeamScore}</p>
        </div>
      )}
    </div>
  );
}

export default NewGame

