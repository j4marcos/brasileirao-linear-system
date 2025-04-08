// NetworkContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import { performGaussSeidelIteration } from "../utils/gaussSeidel";

// Interfaces para tipagem dos dados
export interface INode {
  id: string;
  name: string;
  type: string;
  demand: number;
  capacity: number;
  currentBalance: number;
  position: {
    x: number;
    y: number;
  };
}

export interface IConnection {
  id: string;
  from: string;
  to: string;
  capacity: number;
  currentFlow: number;
  initialFlow: number;
}

export interface IIterationData {
  currentIteration: number;
  totalError: number;
  explanation: string;
}

export interface INetworkContext {
  nodes: INode[];
  connections: IConnection[];
  iterationData: IIterationData;
  addNode: (
    node: Omit<INode, "currentBalance" | "position"> &
      Partial<{ position: { x: number; y: number } }>
  ) => void;
  addConnection: (connection: Omit<IConnection, "currentFlow">) => void;
  runNextIteration: () => void;
  resetIterations: () => void;
  convergenceData: { iteration: number; error: number }[];
}

export const NetworkContext = createContext<INetworkContext>(
  {} as INetworkContext
);

interface IProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<IProps> = ({ children }) => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [iterationData, setIterationData] = useState<IIterationData>({
    currentIteration: 0,
    totalError: 0,
    explanation: "Inicie a iteração para ver o ajuste dos fluxos.",
  });
  const [convergenceData, setConvergenceData] = useState<
    { iteration: number; error: number }[]
  >([]);

  // Adiciona um nó com validação dos dados
  const addNode = (
    node: Omit<INode, "currentBalance" | "position"> &
      Partial<{ position: { x: number; y: number } }>
  ) => {
    if (!node.name.trim() || !node.type.trim()) {
      console.error("Nome e Tipo são obrigatórios.");
      return;
    }
    if (node.demand < 0 || node.capacity < 0) {
      console.error("Demanda e capacidade devem ser números não-negativos.");
      return;
    }
    const newNode: INode = {
      ...node,
      currentBalance: 0,
      position: node.position || { x: Math.random() * 500, y: Math.random() * 300 },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // Adiciona uma conexão, validando que 'from' e 'to' sejam diferentes e não vazios
  const addConnection = (connection: Omit<IConnection, "currentFlow">) => {
    if (!connection.from || !connection.to) {
      console.error("Selecione ambos os nós: origem e destino.");
      return;
    }
    if (connection.from === connection.to) {
      console.error("A conexão não pode ser criada entre o mesmo nó.");
      return;
    }
    if (connection.capacity <= 0) {
      console.error("A capacidade deve ser um número positivo.");
      return;
    }
    const newConnection: IConnection = {
      ...connection,
      currentFlow: connection.initialFlow,
    };
    setConnections((prev) => [...prev, newConnection]);
  };

  const runNextIteration = () => {
    const { updatedConnections, updatedNodes, iteration, totalError, explanation } =
      performGaussSeidelIteration(nodes, connections, iterationData.currentIteration);

    setConnections(updatedConnections);
    setNodes(
      updatedNodes.map((node) => {
        const existing = nodes.find((n) => n.id === node.id);
        return {
          ...node,
          // Preserva as informações originais (nome, tipo, demanda, capacidade e posição)
          name: existing?.name || node.name,
          type: existing?.type || node.type,
          demand: existing?.demand ?? node.demand,
          capacity: existing?.capacity ?? node.capacity,
          position: existing ? existing.position : node.position,
        };
      })
    );
    setIterationData({ currentIteration: iteration, totalError, explanation });
    setConvergenceData((prev) => [...prev, { iteration, error: totalError }]);
  };

  const resetIterations = () => {
    setIterationData({
      currentIteration: 0,
      totalError: 0,
      explanation: "Iterações resetadas. Pronto para iniciar novamente.",
    });
    // Opcional: resetar currentFlow e currentBalance de conexões e nós conforme os dados iniciais
    setConvergenceData([]);
  };

  return (
    <NetworkContext.Provider
      value={{
        nodes,
        connections,
        iterationData,
        addNode,
        addConnection,
        runNextIteration,
        resetIterations,
        convergenceData,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
