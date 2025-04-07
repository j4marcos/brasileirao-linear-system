import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeamsPage from './TeamsPage';
import TeamGamesPage from './TeamGamesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeamsPage />} />
      <Route path="/team/:teamId" element={<TeamGamesPage />} />
    </Routes>
  );
}

export default App;
