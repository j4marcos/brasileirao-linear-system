import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Team {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo: string;
  nome: string;
  apelido: string;
}

export const getToken = () => {
  return "Bearer " + import.meta.env.VITE_API_KEY;
};

function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Requisição para buscar os times via API‑Futebol
    const fetchTeams = async () => {
      try {
        const teamIds = Array.from({ length: 3 }, (_, i) => i + 1); // Substitua pelos IDs dos times que deseja buscar
        const fetchedTeams: Team[] = [];

        for (const teamId of teamIds) {
          const response = await fetch(
            `https://api.api-futebol.com.br/v1/times/${teamId}`,
            {
              headers: {
                Authorization: getToken(),
              },
            }
          );
          const team = await response.json();
          fetchedTeams.push(team);
        }

        setTeams(fetchedTeams);
      } catch (error) {
        console.error("Erro ao buscar times:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamClick = (teamId: number) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <div>
      <h1>Times do Brasileirão</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, idx) => (
            <tr
              key={idx}
              onClick={() => handleTeamClick(team.time_id)}
              style={{ cursor: "pointer" }}
            >
              <td>{team.time_id}</td>
              <td>{team.nome_popular}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamsPage;
