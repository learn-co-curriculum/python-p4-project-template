import React from 'react'

  function NewGame() {
  return (
    // <div>Form for creating new game, with date, home team and away team and scores</div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="homeTeam">Home Team:</label>
        <input
          type="text"
          id="homeTeam"
          name="homeTeam"
          value={formData.homeTeam}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="awayTeam">Away Team:</label>
        <input
          type="text"
          id="awayTeam"
          name="awayTeam"
          value={formData.awayTeam}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="homeScore">Home Team Score:</label>
        <input
          type="number"
          id="homeScore"
          name="homeScore"
          value={formData.homeScore}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="awayScore">Away Team Score:</label>
        <input
          type="number"
          id="awayScore"
          name="awayScore"
          value={formData.awayScore}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Game</button>
    </form>
  );
};

export default NewGame