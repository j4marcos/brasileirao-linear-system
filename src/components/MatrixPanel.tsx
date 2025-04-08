// MatrixPanel.tsx
import React, { useContext } from "react";
import { NetworkContext } from "../context/NetworkContext";
import { Box, Typography } from "@mui/material";

// Função de exemplo: cria um array A (matriz) e um array b (vetor) a partir dos nós e conexões
function generateSystemMatrix(nodes: any[], connections: any[]) {
  // Exemplo fictício: cada nó => 1 equação
  // Cada conexão => 1 variável de fluxo
  // Em um caso real, seria preciso indexar as conexões e montar os coeficientes
  // de forma coerente.
  const numNodes = nodes.length;
  const numConnections = connections.length;

  // Matrizes A e vetor b, zeros inicialmente
  // Dimensão: (numNodes) x (numConnections)
  // Vetor b terá dimensão (numNodes)
  const A = Array.from({ length: numNodes }, () => Array(numConnections).fill(0));
  const b = Array(numNodes).fill(0);

  // Cria um índice para cada conexão (variável)
  const connectionIndexMap = new Map();
  connections.forEach((conn, idx) => {
    connectionIndexMap.set(conn.id, idx);
  });

  // Monta as equações
  nodes.forEach((node, nodeIndex) => {
    // Exemplo: soma(entradas) - soma(saídas) = demanda
    // Precisamos encontrar quais conexões entram e quais saem deste nó
    const incoming = connections.filter((c) => c.to === node.id);
    const outgoing = connections.filter((c) => c.from === node.id);

    incoming.forEach((inc) => {
      const varIndex = connectionIndexMap.get(inc.id);
      // +1 para fluxo que entra
      A[nodeIndex][varIndex] = +1;
    });

    outgoing.forEach((out) => {
      const varIndex = connectionIndexMap.get(out.id);
      // -1 para fluxo que sai
      A[nodeIndex][varIndex] = -1;
    });

    // Move a demanda para o lado direito
    // Se for demanda > 0, significa que nós precisamos desse valor; a equação ficaria:
    // soma(entradas) - soma(saídas) = demanda
    b[nodeIndex] = node.demand;
  });

  return { A, b };
}

const MatrixPanel: React.FC = () => {
  const { nodes, connections } = useContext(NetworkContext);
  const { A, b } = generateSystemMatrix(nodes, connections);

  return (
    <Box sx={{ my: 3, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom>
        Matriz do Sistema Linear (A) e Vetor (b)
      </Typography>

      {A.length === 0 || A[0].length === 0 ? (
        <Typography variant="body2">Não há dados suficientes para formar uma matriz.</Typography>
      ) : (
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #aaa", padding: "4px" }}> </th>
                {A[0].map((_, j) => (
                  <th key={j} style={{ border: "1px solid #aaa", padding: "4px" }}>
                    x{j}
                  </th>
                ))}
                <th style={{ border: "1px solid #aaa", padding: "4px" }}>b</th>
              </tr>
            </thead>
            <tbody>
              {A.map((row, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #aaa", padding: "4px" }}>
                    Eq{i}
                  </td>
                  {row.map((val, j) => (
                    <td key={j} style={{ border: "1px solid #aaa", padding: "4px" }}>
                      {val.toFixed(2)}
                    </td>
                  ))}
                  <td style={{ border: "1px solid #aaa", padding: "4px" }}>
                    {b[i].toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      <Typography variant="body2">
        Cada linha representa a equação de um nó, cada coluna x<em>j</em> corresponde ao fluxo de uma
        conexão, e <em>b</em> corresponde à demanda no nó.
      </Typography>
    </Box>
  );
};

export default MatrixPanel;
