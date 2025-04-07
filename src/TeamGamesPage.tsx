import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as math from "mathjs";
import { getToken } from "./TeamsPage";

export interface PartidasAnterioresResponse {
  partida_id: number;
  data: string;
  time_mandante: {
    time_id: number;
    nome_popular: string;
  };
  time_visitante: {
    time_id: number;
    nome_popular: string;
  };
  placar_mandante: number;
  placar_visitante: number;
  escalacoes?: {
    mandante: {
      titulares: Array<{
        atleta_id: number;
        nome: string;
      }>;
    };
    visitante: {
      titulares: Array<{
        atleta_id: number;
        nome: string;
      }>;
    };
  };
}

interface Player {
  atleta_id: number;
  nome: string;
  total_minutos?: number;
  total_gols?: number;
  total_assists?: number;
  impacto?: number; // Adiciona a propriedade impacto
}

function TeamGamesPage() {
  const { teamId } = useParams();
  const [games, setGames] = useState<PartidasAnterioresResponse[]>([]);
  const [players, setPlayers] = useState<Player[]>([]); // Extraídos das escalações
  interface CalculationSteps {
    matrixA: number[][];
    vectorB: number[];
    solution: number[];
  }

  const [calculationSteps, setCalculationSteps] =
    useState<CalculationSteps | null>(null);
  const [rankings, setRankings] = useState<Player[] | null>(null);

  useEffect(() => {
    // Requisição para buscar partidas anteriores do time
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `https://api.api-futebol.com.br/v1/times/${teamId}/partidas/anteriores`,
          {
            headers: {
              Authorization: getToken(), // Substitua pela sua chave de API
            },
          }
        );
        const data = await response.json();
        // Supondo que data seja um array de partidas
        setGames(data);
        // Extrair jogadores das escalações (exemplo: apenas titulares)
        let playersMap: {
          [key: number]: Player;
        } = {};
        data.forEach((game: PartidasAnterioresResponse) => {
          if (game.escalacoes) {
            // Verifica se o time é o mandante ou visitante
            const isHome = game.time_mandante.time_id === Number(teamId);
            const lineup = isHome
              ? game.escalacoes.mandante.titulares
              : game.escalacoes.visitante.titulares;
            lineup.forEach((player) => {
              playersMap[player.atleta_id] = player;
            });
          }
        });
        setPlayers(Object.values(playersMap));
      } catch (error) {
        console.error("Erro ao buscar partidas:", error);
      }
    };

    fetchGames();
  }, [teamId]);

  // Função que simula o cálculo do impacto dos jogadores usando um sistema linear
  const calculateImpact = () => {
    /* 
      Para fins de demonstração, vamos considerar três variáveis de desempenho:
      - x1: impacto por minuto jogado
      - x2: impacto por gol
      - x3: impacto por assistência
      
      Suponha que em três jogos temos as seguintes equações (valores fictícios):
      
         Equação 1: 90*x1 + 1*x2 + 0*x3 = 100
         Equação 2: 80*x1 + 0*x2 + 1*x3 = 80
         Equação 3: 70*x1 + 2*x2 + 0*x3 = 120
      
      Resolvemos esse sistema para encontrar os coeficientes x1, x2 e x3.
    */
    const A = [
      [90, 1, 0],
      [80, 0, 1],
      [70, 2, 0],
    ];
    const b = [100, 80, 120];

    // Utiliza math.js para resolver o sistema linear
    const solution = math.lusolve(A, b);
    const x = (solution as number[][]).map((row) => row[0]); // Converte solução para array simples

    // Guardamos os detalhes do cálculo para exibição
    const calcSteps = {
      matrixA: A,
      vectorB: b,
      solution: x,
    };
    setCalculationSteps(calcSteps);

    // Agora, para cada jogador, calculamos o impacto como uma média ponderada:
    // Impacto = x1*(total_minutos/num_games) + x2*(total_gols/num_games) + x3*(total_assists/num_games)
    // Para este exemplo, usamos dados simulados para cada jogador.
    const numGames = 3;
    const playersWithImpact = players.map((player) => {
      // Se os dados reais não estiverem disponíveis, usamos números aleatórios para demonstração.
      const total_minutos =
        player.total_minutos || Math.floor(Math.random() * 100 + 60); // 60 a 160 minutos
      const total_gols = player.total_gols || Math.floor(Math.random() * 3); // 0 a 2 gols
      const total_assists =
        player.total_assists || Math.floor(Math.random() * 2); // 0 a 1 assistência
      const impacto =
        x[0] * (total_minutos / numGames) +
        x[1] * (total_gols / numGames) +
        x[2] * (total_assists / numGames);
      return { ...player, total_minutos, total_gols, total_assists, impacto };
    });

    // Ordena os jogadores pelo impacto decrescente
    playersWithImpact.sort((a, b) => b.impacto - a.impacto);
    setRankings(playersWithImpact);
  };

  return (
    <div>
      <h1>Jogos do Time {teamId}</h1>
      <h2>Partidas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>ID da Partida</th>
            <th>Data</th>
            <th>Mandante</th>
            <th>Visitante</th>
            <th>Placar</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.partida_id}>
              <td>{game.partida_id}</td>
              <td>{game.data}</td>
              <td>{game.time_mandante.nome_popular}</td>
              <td>{game.time_visitante.nome_popular}</td>
              <td>
                {game.placar_mandante} x {game.placar_visitante}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={calculateImpact}>Calcular Impacto dos Jogadores</button>

      {calculationSteps && (
        <div>
          <h2>Detalhes do Cálculo (Sistema Linear)</h2>
          <p>
            <strong>Matriz A:</strong>{" "}
            {JSON.stringify(calculationSteps.matrixA)}
          </p>
          <p>
            <strong>Vetor B:</strong> {JSON.stringify(calculationSteps.vectorB)}
          </p>
          <p>
            <strong>Solução (Coeficientes):</strong>{" "}
            {JSON.stringify(calculationSteps.solution)}
          </p>
        </div>
      )}

      {rankings && (
        <div>
          <h2>Ranking de Impacto dos Jogadores</h2>
          <table border={1}>
            <thead>
              <tr>
                <th>ID do Jogador</th>
                <th>Nome</th>
                <th>Total Minutos</th>
                <th>Total Gols</th>
                <th>Total Assists</th>
                <th>Impacto</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((player) => (
                <tr key={player.atleta_id}>
                  <td>{player.atleta_id}</td>
                  <td>{player.nome}</td>
                  <td>{player.total_minutos}</td>
                  <td>{player.total_gols}</td>
                  <td>{player.total_assists}</td>
                  <td>{player.impacto?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeamGamesPage;
